import useCurrentPath from '../hooks/useCurrentPath'

// Routes: children으로 받은 Route 컴포넌트 중 현재 경로와 일치하는 것을 렌더링
export function Routes({ children }) {
  const currentPath = useCurrentPath()

  const matched = children.find((child) => child.props.path === currentPath)
  return matched ?? <h1 style={{ textAlign: 'center', marginTop: '4rem' }}>404 Not Found</h1>
}

// Route: path와 element props만 가지는 선언형 컴포넌트
export function Route({ element }) {
  return element
}
