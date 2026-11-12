import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State { hasError: boolean }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-xl font-bold text-brand">Ocorreu um problema inesperado</h1>
          <p className="mt-2 text-sm text-ink-muted">Recarregue a página para continuar a utilizar a KANDIDATU.</p>
          <button type="button" className="btn-primary mt-6" onClick={() => window.location.reload()}>
            Recarregar aplicação
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

