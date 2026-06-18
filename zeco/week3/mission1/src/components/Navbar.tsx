import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: '홈', end: true },
  { to: '/movies/popular', label: '인기 영화', end: false },
  { to: '/movies/upcoming', label: '개봉 예정', end: false },
  { to: '/movies/now_playing', label: '상영중', end: false },
  { to: '/movies/top_rated', label: '평점 높은', end: false },
];

export const Navbar = () => {
  return (
    <div className="flex gap-3 p-4">
      {LINKS.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => {
            return isActive ? 'text-[#b2dab1] font-bold' : 'text-gray-500';
          }}
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
};
