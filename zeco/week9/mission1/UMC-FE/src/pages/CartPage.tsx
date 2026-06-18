import { usePlaylistStore } from '../redux/usePlaylistStore';
import CartNavbar from '../components/CartNavbar';
import ClearCartModal from '../components/ClearCartModal';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { cartItems, increase, decrease, removeItem, openModal } = usePlaylistStore();

  return (
    <div className={styles.container}>
      <CartNavbar />

      <div className={styles.content}>
        {cartItems.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>장바구니가 비어있습니다.</p>
          </div>
        ) : (
          <div className={styles.itemsList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.item}>
                {/* 왼쪽: 이미지 + 정보 */}
                <div className={styles.leftSection}>
                  {/* 앨범 이미지 */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className={styles.itemImage}
                  />

                  {/* 앨범 정보 */}
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemSinger}>{item.singer}</p>
                    <p className={styles.itemPrice}>
                      ${Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 오른쪽: 수량 조절 */}
                <div className={styles.quantityControl}>
                  <button
                    onClick={() => decrease(item.id)}
                    className={styles.quantityBtn}
                  >
                    −
                  </button>
                  <span className={styles.quantityText}>{item.amount}</span>
                  <button
                    onClick={() => increase(item.id)}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className={styles.footer}>
          <button
            onClick={() => openModal()}
            className={styles.clearBtn}
          >
            전체 삭제
          </button>
        </div>
      )}

      {/* Modal */}
      <ClearCartModal />
    </div>
  );
}
