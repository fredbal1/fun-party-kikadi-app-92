
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-600 to-blue-500">
    <div className="text-center text-white">
      <div className="text-4xl mb-4 animate-pulse">🎮</div>
      <div className="text-xl font-semibold mb-2">KIKADI</div>
      <div className="text-sm opacity-80">Chargement en cours...</div>
    </div>
  </div>
);

export default LoadingScreen;
