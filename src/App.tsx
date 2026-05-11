import { useStore } from './store/useStore';
import { StartScreen } from './components/StartScreen';
import { QuestScreen } from './components/QuestScreen';
// import { ResultScreen } from './components/ResultScreen'; // Vamos criar essa a seguir

function App() {
  const currentStep = useStore((state) => state.currentStep);

  return (
    <div className="min-h-screen bg-dark bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white p-4 font-sans selection:bg-neon-green selection:text-black">
      <main className="container mx-auto">
        {currentStep === 'start' && <StartScreen />}
        {currentStep === 'quests' && <QuestScreen />}
        {currentStep === 'result' && (
          <div className="flex items-center justify-center min-h-[80vh] text-2xl font-mono text-neon-green animate-pulse">
            &gt; GERANDO_BUILD... {/* Placeholder para a próxima etapa */}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;