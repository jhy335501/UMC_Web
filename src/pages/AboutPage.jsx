export default function AboutPage() {
  return (
    <main className="page">
      <h2>About 페이지</h2>
      <p>이 프로젝트는 React와 History API를 활용한 SPA 구현 예제입니다.</p>
      <ul>
        <li><strong>useCurrentPath</strong> 훅 — URL 변화를 React 상태로 관리</li>
        <li><strong>Link</strong> 컴포넌트 — history.pushState() 로 URL 변경</li>
        <li><strong>Routes / Route</strong> — 경로에 맞는 컴포넌트 선언형 렌더링</li>
      </ul>
    </main>
  )
}
