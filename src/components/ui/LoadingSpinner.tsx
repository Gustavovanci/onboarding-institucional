// src/components/ui/LoadingSpinner.tsx
const LoadingSpinner = () => {
  return (
    <div
      // CORREÇÃO #5: 'brand-primary' não existia, trocado por 'brand-azure' que está no tema.
      className="w-12 h-12 animate-spin rounded-full border-4 border-gray-300 border-t-brand-azure"
      role="status"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;