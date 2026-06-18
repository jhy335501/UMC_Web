import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './components/ProtectedLayout';
import RootLayout from './layouts/RootLayout';
import CartLayout from './layouts/CartLayout';
import LpListPage from './pages/LpListPage';
import LpDetailPage from './pages/LpDetailPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import NotFoundPage from './pages/NotFoundPage';
import GoogleLoginResultPage from './pages/GoogleLoginResultPage';
import CartPage from './pages/CartPage';
import MovieSearchPage from './pages/MovieSearchPage';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '/', element: <LpListPage /> },
      { path: '/movies', element: <MovieSearchPage /> },
      { path: '/movies/:movieId', element: <MovieDetailPage /> },
      { path: '/lp/:lpid', element: <LpDetailPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/v1/auth/google/callback', element: <GoogleLoginResultPage /> },
      {
        element: <ProtectedLayout />,
        children: [{ path: '/my', element: <MyPage /> }],
      },
    ],
  },
  {
    element: <CartLayout />,
    children: [{ path: '/cart', element: <CartPage /> }],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
