import { Outlet } from 'react-router-dom';
import styles from './CartLayout.module.css';

export default function CartLayout() {
  return (
    <div className={styles.layout}>
      <Outlet />
    </div>
  );
}
