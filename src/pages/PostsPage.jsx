const POSTS = [
  { id: 1, title: 'SPA란 무엇인가?', body: '전체 페이지를 새로 로드하지 않고 동적으로 콘텐츠를 갱신하는 방식입니다.' },
  { id: 2, title: 'History API 이해하기', body: 'pushState / replaceState / popstate 이벤트를 활용하면 URL을 자유롭게 제어할 수 있습니다.' },
  { id: 3, title: '커스텀 훅 패턴', body: '로직을 분리하여 재사용 가능한 훅으로 만들면 코드가 훨씬 깔끔해집니다.' },
]

export default function PostsPage() {
  return (
    <main className="page">
      <h2>Posts 페이지</h2>
      <ul className="post-list">
        {POSTS.map((post) => (
          <li key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
