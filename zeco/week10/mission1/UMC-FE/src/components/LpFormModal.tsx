import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLp, patchLp, uploadImage } from '../apis/lp';
import { QUERY_KEY } from '../utils/constants/queryKeys';
import type { Lp } from '../types/lp';

interface LpFormModalProps {
  onClose: () => void;
  editTarget?: Lp;
}

export default function LpFormModal({ onClose, editTarget }: LpFormModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(editTarget?.title ?? '');
  const [content, setContent] = useState(editTarget?.content ?? '');
  const [tags, setTags] = useState<string[]>(editTarget?.tags.map((t) => t.name) ?? []);
  const [tagInput, setTagInput] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    editTarget?.thumbnail ?? null,
  );
  const [formError, setFormError] = useState<string | null>(null);

  // 미리보기 blob URL 정리: thumbnailPreview가 바뀌기 직전과 언마운트 시,
  // createObjectURL로 만든 blob URL이면 해제해 메모리 누수를 막는다.
  // (editTarget.thumbnail 같은 일반 http URL은 해제 대상이 아님)
  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const mutation = useMutation({
    mutationFn: async () => {
      // 1단계: 새 이미지 파일이 있으면 먼저 업로드 → URL 받기
      let thumbnailUrl: string | undefined;
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile);
      } else if (editTarget?.thumbnail) {
        thumbnailUrl = editTarget.thumbnail;
      }

      // 2단계: LP 생성 or 수정 (JSON body)
      const payload = {
        title: title.trim(),
        content: content.trim(),
        tags,
        published: true,
        ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
      };

      return editTarget ? patchLp(editTarget.id, payload) : postLp(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LP_LIST] });
      if (editTarget) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LP_DETAIL, editTarget.id] });
      }
      onClose();
    },
    onError: () => {
      setFormError('저장에 실패했습니다. 다시 시도해주세요.');
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function handleAddTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  }

  function handleRemoveTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setFormError('제목을 입력해주세요.'); return; }
    if (!content.trim()) { setFormError('내용을 입력해주세요.'); return; }
    if (tags.length === 0) { setFormError('태그를 최소 1개 이상 입력해주세요.'); return; }

    setFormError(null);
    mutation.mutate();
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">
            {editTarget ? 'LP 수정' : 'LP 추가'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* 썸네일 */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">앨범 커버</label>
            <div
              className="w-44 h-44 mx-auto rounded-full bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer overflow-hidden hover:border-yellow-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <span className="text-4xl">🎵</span>
                  <span className="text-xs text-center px-2">클릭하여 이미지 선택</span>
                </div>
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

          {/* 제목 */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">제목 *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="LP 제목을 입력해주세요"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm outline-none placeholder:text-gray-500 focus:border-yellow-500"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">내용 *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="LP에 대한 설명을 입력해주세요"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm outline-none placeholder:text-gray-500 focus:border-yellow-500 resize-none"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">태그 * (최소 1개)</label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }
                }}
                placeholder="태그를 입력 후 추가 버튼을 눌러주세요"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm outline-none placeholder:text-gray-500 focus:border-yellow-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors shrink-0"
              >
                추가
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-yellow-400 text-xs rounded-full border border-gray-700"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-white ml-1 leading-none"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending
              ? (thumbnailFile ? '이미지 업로드 중...' : '저장 중...')
              : editTarget ? 'LP 수정' : 'Add LP'}
          </button>
        </form>
      </div>
    </div>
  );
}
