// src/components/common/AppErrorBoundary.tsx
import React from 'react';

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: any };

export default class AppErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Erro capturado pelo ErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="max-w-lg">
            <h1 className="text-2xl font-bold mb-3">Algo deu errado 😕</h1>
            <p className="text-gray-600 mb-6">
              Um erro inesperado ocorreu. Você pode recarregar a página para tentar novamente.
            </p>
            <button onClick={this.handleReload} className="btn-primary">Recarregar</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
