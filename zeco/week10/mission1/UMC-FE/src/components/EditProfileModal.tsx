import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMyInfo } from '../apis/auth';
import { uploadImage } from '../apis/lp';
import { useAuth } from '../context/useAuth';
import { QUERY_KEY } from '../utils/constants/queryKeys';
import type { CommonResponse, ResponseMyInfo } from '../types/auth';

interface EditProfileModalProps {
  currentProfile: ResponseMyInfo;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({
  currentProfile,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const { refreshUser, updateUser, user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentProfile.name);
  const [bio, setBio] = useState(currentProfile.bio ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentProfile.avatar ?? null,
  );
  const [formError, setFormError] = useState<string | null>(null);

  // 미리보기 blob URL 정리 (LpFormModal과 동일): 미리보기가 바뀌기 직전·언마운트 시
  // createObjectURL로 만든 blob URL이면 해제한다. (currentProfile.avatar 같은 일반 URL은 제외)
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const mutation = useMutation({
    mutationFn: async () => {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }
      return patchMyInfo({
        name: name.trim(),
        bio: bio.trim() || undefined,
        ...(avatarUrl ? { avatar: avatarUrl } : {}),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.MY_INFO] });

      const previousMyInfo = queryClient.getQueryData<CommonResponse<ResponseMyInfo>>([QUERY_KEY.MY_INFO]);
      const previousUser = user;

      const optimisticName = name.trim();
      const optimisticBio = bio.trim() || null;

      // QueryCache 낙관적 업데이트 → MyPage 즉시 반영
      queryClient.setQueryData<CommonResponse<ResponseMyInfo>>([QUERY_KEY.MY_INFO], (old) => {
        if (!old) return old;
        return { ...old, data: { ...old.data, name: optimisticName, bio: optimisticBio } };
      });

      // AuthContext 낙관적 업데이트 → Nav-Bar 즉시 반영
      updateUser({ name: optimisticName, bio: optimisticBio });

      return { previousMyInfo, previousUser };
    },
    onSuccess: async () => {
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MY_INFO] });
      onSuccess();
      onClose();
    },
    onError: (_err, _vars, context) => {
      // 낙관적 업데이트 롤백
      if (context?.previousMyInfo !== undefined) {
        queryClient.setQueryData([QUERY_KEY.MY_INFO], context.previousMyInfo);
      }
      if (context?.previousUser) {
        updateUser(context.previousUser);
      }
      setFormError('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('이름을 입력해주세요.');
      return;
    }
    setFormError(null);
    mutation.mutate();
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">프로필 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* 프로필 사진 */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">프로필 사진</label>
            <div
              className="w-24 h-24 mx-auto rounded-full bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer overflow-hidden hover:border-yellow-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-3xl font-bold">
                  {currentProfile.name[0]?.toUpperCase() ?? '?'}
                </span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* 이름 */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">이름 *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm outline-none placeholder:text-gray-500 focus:border-yellow-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력해주세요 (선택)"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm outline-none placeholder:text-gray-500 focus:border-yellow-500 resize-none"
            />
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending
              ? (avatarFile ? '이미지 업로드 중...' : '저장 중...')
              : '저장'}
          </button>
        </form>
      </div>
    </div>
  );
}
