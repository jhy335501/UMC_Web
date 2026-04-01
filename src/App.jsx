import Link from './components/Link'
import { Routes, Route } from './components/Router'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import PostsPage from './pages/PostsPage'
import useCurrentPath from './hooks/useCurrentPath'
import './App.css'

function NavBar() {
  const currentPath = useCurrentPath()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/posts', label: 'Posts' },
  ]

  return (
    <nav className="navbar">
      <span className="nav-brand">My SPA</span>
      <ul className="nav-links">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} className={currentPath === to ? 'active' : ''}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/posts" element={<PostsPage />} />
      </Routes>
    </div>
  )
}
