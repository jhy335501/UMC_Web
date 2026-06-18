import { usePlaylistStore } from '../store/usePlaylistStore';

export default function ClearCartModal() {
  const { isModalOpen, clearCart, closeModal } = usePlaylistStore();

  if (!isModalOpen) return null;

  const handleConfirm = () => {
    clearCart();
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '32px',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>
          전체 삭제 확인
        </h2>
        <p style={{ color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
          장바구니의 모든 음반을 삭제하시겠습니까?
          <br />
          이 작업은 되돌릴 수 없습니다.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '10px 20px',
              border: '2px solid #333',
              backgroundColor: 'white',
              color: '#333',
              fontWeight: 'bold',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: '10px 20px',
              border: '2px solid #d32f2f',
              backgroundColor: '#d32f2f',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
