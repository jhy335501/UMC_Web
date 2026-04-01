// Link 컴포넌트: <a> 태그의 기본 동작(페이지 새로고침)을 막고
// history.pushState()로 URL만 변경한 뒤 커스텀 이벤트를 발생시킨다.
export default function Link({ to, children, className }) {
  const handleClick = (e) => {
    e.preventDefault() // 전체 페이지 reload 방지
    window.history.pushState(null, '', to)
    // popstate는 pushState 시 자동으로 발생하지 않으므로 직접 dispatch
    window.dispatchEvent(new Event('pushstate'))
  }

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
