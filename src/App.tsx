import './App.css';
import { useState, useEffect } from 'react';
import { feature } from 'topojson-client';
import { WorldMap } from './components/WorldMap/WorldMap';
import { QuizPanel } from './components/Quiz/QuizPanel';
import { ResultScreen } from './components/Quiz/ResultScreen';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { StartScreen } from './components/Quiz/StartScreen';
import { useQuizStore } from './store/quizStore';
import { useSettingsStore } from './store/settingsStore';
import { useQuizEngine } from './hooks/useQuizEngine';
import { getIsoCode } from './utils/countryNameMapping';
import countriesData from './data/countries.json';
import citiesData from './data/cities.json';

type AppScreen = 'start' | 'settings' | 'quiz' | 'results';

function App() {
  const [screen, setScreen] = useState<AppScreen>('start');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topoData, setTopoData] = useState<any>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswerName?: string;
    selectedAnswerName?: string;
  } | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | undefined>(undefined);

  const { mode } = useSettingsStore();
  const {
    isQuizActive,
    getCurrentQuestion,
    answerQuestion,
    nextQuestion,
  } = useQuizStore();

  const { useCustomSelection, selectedCities } = useSettingsStore();

  const { initializeQuiz } = useQuizEngine();

  // Load world topology data
  useEffect(() => {
    const loadTopoData = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const world: any = await import('world-atlas/countries-110m.json');
        
        // Convert TopoJSON to GeoJSON using topojson-client
        const countriesGeo = feature(world, world.objects.countries) as any;
        
        // Create a lookup map from country names to ISO codes
        const nameToIso: { [key: string]: string } = {};
        (countriesData as any[]).forEach(country => {
          nameToIso[country.nameEn.toLowerCase()] = country.iso;
        });
        
        // Enrich GeoJSON features with our ISO codes
        const enrichedFeatures = (countriesGeo.features || []).map((feat: any) => {
          const countryName = feat.properties?.name || '';
          
          // Try mapping first, then fallback to direct lookup
          let iso = getIsoCode(countryName);
          if (!iso) {
            iso = nameToIso[countryName.toLowerCase()] || '';
          }
          
          return {
            ...feat,
            properties: {
              ...feat.properties,
              iso_a2: iso,
            },
          };
        });
        
        setTopoData({
          type: 'FeatureCollection',
          features: enrichedFeatures,
        } as any);
      } catch (error) {
        console.error('Error loading topology data:', error);
      }
    };
    loadTopoData();
  }, []);

  const currentQuestion = getCurrentQuestion();

  const handleStartQuiz = () => {
    initializeQuiz();
    setScreen('quiz');
    setFeedback(null);
    setHighlightedId(undefined);
  };

  const handleCountryClick = (iso: string) => {
    if (!currentQuestion || feedback) return;

    const isCorrect = iso === currentQuestion.id;
    answerQuestion(isCorrect);

    const correctCountry = (countriesData as any[]).find(
      (c) => c.iso === currentQuestion.id
    );
    const selectedCountry = (countriesData as any[]).find(
      (c) => c.iso === iso
    );

    setFeedback({
      isCorrect,
      correctAnswerName: correctCountry?.nameEn,
      selectedAnswerName: selectedCountry?.nameEn,
    });

    setHighlightedId(currentQuestion.id);

    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
      setFeedback(null);
      setHighlightedId(undefined);
    }, 2000);
  };

  const handleCityClick = (cityId: string) => {
    if (!currentQuestion || feedback) return;

    const isCorrect = cityId === currentQuestion.id;
    answerQuestion(isCorrect);

    const correctCity = (citiesData as any[]).find(
      (c) => c.id === currentQuestion.id
    );
    const selectedCity = (citiesData as any[]).find(
      (c) => c.id === cityId
    );

    setFeedback({
      isCorrect,
      correctAnswerName: correctCity?.nameEn,
      selectedAnswerName: selectedCity?.nameEn,
    });

    setHighlightedId(currentQuestion.id);

    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
      setFeedback(null);
      setHighlightedId(undefined);
    }, 2000);
  };

  const handlePlayAgain = () => {
    handleStartQuiz();
  };

  const handleChangeSettings = () => {
    setScreen('settings');
  };

  // Render different screens based on state
  if (screen === 'start') {
    return (
      <StartScreen
        onSettingsClick={() => setScreen('settings')}
        onStart={handleStartQuiz}
      />
    );
  }

  if (screen === 'settings') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <SettingsPanel
          onClose={() => setScreen('start')}
          onStart={handleStartQuiz}
        />
      </div>
    );
  }

  if (screen === 'quiz') {
    if (!isQuizActive || !currentQuestion) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <ResultScreen
            onPlayAgain={handlePlayAgain}
            onChangeSettings={handleChangeSettings}
          />
        </div>
      );
    }

    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="flex w-full h-full gap-4 p-4 bg-gray-100">
          {/* Map */}
          <div className="flex-1 flex items-center justify-center">
            <WorldMap
              width={window.innerWidth - 420}
              height={window.innerHeight - 40}
              topoData={topoData}
              highlightedCountryId={
                mode === 'countries' ? highlightedId : undefined
              }
              highlightedCityId={mode === 'cities' ? highlightedId : undefined}
              showCities={mode === 'cities'}
              visibleCityIds={useCustomSelection && selectedCities.length > 0 ? selectedCities : undefined}
              onCountryClick={handleCountryClick}
              onCityClick={handleCityClick}
            />
          </div>

          {/* Quiz Panel */}
          <div className="w-96 flex items-center justify-center">
            <QuizPanel feedback={feedback} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
