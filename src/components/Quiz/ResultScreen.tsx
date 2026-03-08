import { useQuizStore } from '../../store/quizStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getTranslation } from '../../i18n';
import { Button } from '../UI/Button';
import { Badge } from '../UI/Badge';

interface ResultScreenProps {
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  onPlayAgain,
  onChangeSettings,
}) => {
  const { language } = useSettingsStore();
  const { results } = useQuizStore();

  const t = getTranslation(language);

  const correctCount = results.filter((r: { isCorrect: boolean }) => r.isCorrect).length;
  const incorrectCount = results.length - correctCount;
  const percentage = Math.round((correctCount / results.length) * 100);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {t.results.finalScore}
      </h2>

      {/* Score display */}
      <div className="text-center mb-8">
        <div className="inline-block">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {correctCount}
            <span className="text-3xl text-gray-400">/{results.length}</span>
          </div>
          <div className="text-2xl text-gray-600 mb-4">
            {percentage}% {t.results.correct}
          </div>

          {/* Badge based on performance */}
          <div className="mb-6">
            {percentage >= 80 && (
              <Badge label="Excellent!" variant="success" />
            )}
            {percentage >= 60 && percentage < 80 && (
              <Badge label="Good job!" variant="primary" />
            )}
            {percentage >= 40 && percentage < 60 && (
              <Badge label="Keep practicing" variant="warning" />
            )}
            {percentage < 40 && (
              <Badge label="Try again!" variant="danger" />
            )}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
        <div className="text-center">
          <p className="text-gray-600 text-sm">{t.results.questionsAnswered}</p>
          <p className="text-2xl font-bold text-gray-800">{results.length}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm text-green-600">
            {t.results.correct}
          </p>
          <p className="text-2xl font-bold text-green-600">{correctCount}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm text-red-600">Incorrect</p>
          <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onPlayAgain}
          variant="primary"
          size="lg"
          fullWidth
        >
          {t.results.playAgain}
        </Button>
        <Button
          onClick={onChangeSettings}
          variant="secondary"
          size="lg"
          fullWidth
        >
          {t.results.changeSettings}
        </Button>
      </div>
    </div>
  );
};
