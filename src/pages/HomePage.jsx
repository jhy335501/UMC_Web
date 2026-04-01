import Link from '../components/Link'

export default function HomePage() {
  return (
    <main className="page">
      <h2>홈 페이지</h2>
      <p>안녕하세요! 이곳은 커스텀 라우터로 구현한 SPA의 홈 페이지입니다.</p>
      <p>
        React Router 없이 <strong>History API</strong>와 커스텀 훅만으로
        페이지 전환을 구현했습니다.
      </p>
      <div className="card-grid">
        <Link to="/about" className="card">About 페이지로 이동 →</Link>
        <Link to="/posts" className="card">Posts 페이지로 이동 →</Link>
      </div>
    </main>
  )
}
