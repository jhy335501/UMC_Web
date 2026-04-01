import { useState, useEffect } from 'react'

// 현재 URL의 pathname을 React 상태로 관리하는 커스텀 훅
// popstate 이벤트(뒤로가기/앞으로가기)와 커스텀 pushstate 이벤트를 구독하여
// URL이 바뀔 때마다 컴포넌트를 리렌더링시킨다.
export default function useCurrentPath() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    // 브라우저 뒤로가기 / 앞으로가기
    window.addEventListener('popstate', handleLocationChange)
    // Link 컴포넌트에서 pushState 후 직접 발생시키는 커스텀 이벤트
    window.addEventListener('pushstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('pushstate', handleLocationChange)
    }
  }, [])

  return currentPath
}
