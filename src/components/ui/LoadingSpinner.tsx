const LoadingSpinner = () => {
  return (
    <div
      className="w-12 h-12 animate-spin rounded-full border-4 border-gray-300 border-t-brand-primary"
      role="status"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;