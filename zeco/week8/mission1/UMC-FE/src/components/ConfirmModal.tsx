interface ConfirmModalProps {
  message: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  danger?: boolean;
  error?: string | null;
}

export default function ConfirmModal({
  message,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  isLoading = false,
  danger = false,
  error,
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-80 max-w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white font-semibold text-center mb-2">{message}</p>
        {description && (
          <p className="text-gray-400 text-sm text-center mb-4">{description}</p>
        )}
        {error && (
          <p className="text-red-400 text-sm text-center mt-1 mb-2">{error}</p>
        )}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors
              ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-500 hover:bg-yellow-600'}`}
          >
            {isLoading ? '처리 중...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
