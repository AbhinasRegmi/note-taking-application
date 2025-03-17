export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-12 h-12 border-4 border-accent border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
