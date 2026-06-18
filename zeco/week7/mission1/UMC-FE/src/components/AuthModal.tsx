interface AuthModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AuthModal({ onConfirm, onCancel }: AuthModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-80 flex flex-col gap-4">
        <h2 className="text-white font-bold text-lg text-center">로그인이 필요합니다</h2>
        <p className="text-gray-400 text-sm text-center">
          이 페이지를 이용하려면 로그인이 필요합니다.
          <br />
          로그인 페이지로 이동하시겠습니까?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
