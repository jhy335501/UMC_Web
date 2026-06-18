import { Link } from 'react-router-dom';
import { usePlaylistStore } from '../store/usePlaylistStore';
import styles from './CartNavbar.module.css';

export default function CartNavbar() {
  const { amount } = usePlaylistStore();

  return (
    <nav className={styles.navbar}>
      <Link to="/cart" className={styles.logo}>
        zeco
      </Link>
      <div className={styles.cartInfo}>
        <span>🛒</span>
        <span>{amount}</span>
      </div>
    </nav>
  );
}
