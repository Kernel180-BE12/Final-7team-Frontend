import AppRouter from './router/AppRouter'

function App() {
  try {
    return <AppRouter />
  } catch (error) {
    return (
      <div style={{ padding: '20px', background: 'red', color: 'white' }}>
        <h1>에러 발생!</h1>
        <p>{error instanceof Error ? error.message : '알 수 없는 에러'}</p>
        <details>
          <summary>상세 정보</summary>
          <pre>{error instanceof Error ? error.stack : JSON.stringify(error)}</pre>
        </details>
      </div>
    )
  }
}

export default App
