import React from 'react';
import { useQuizStore } from '../../store/quizStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getTranslation } from '../../i18n';
import { Badge } from '../UI/Badge';

interface QuizPanelProps {
  feedback?: {
    isCorrect: boolean;
    correctAnswerName?: string;
    selectedAnswerName?: string;
  } | null;
}

export const QuizPanel: React.FC<QuizPanelProps> = ({ feedback }) => {
  const { language } = useSettingsStore();
  const { getCurrentQuestion, score, questions, currentQuestionIndex } =
    useQuizStore();

  const t = getTranslation(language);
  const currentQuestion = getCurrentQuestion();

  if (!currentQuestion) {
    return null;
  }

  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      {/* Header with score and progress */}
      <div className="flex justify-between items-center mb-4">
        <Badge
          label={`${t.quiz.score}: ${score}/${totalQuestions}`}
          variant="primary"
        />
        <span className="text-sm text-gray-600">
          {t.quiz.question} {questionNumber}/{totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          {useSettingsStore().mode === 'countries'
            ? t.quiz.selectCountry
            : t.quiz.selectCity}
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-gray-800 mb-2">
            {currentQuestion.nameEn}
          </p>
          <p className="text-lg text-gray-600">{currentQuestion.nameFi}</p>
        </div>
      </div>

      {/* Feedback section */}
      {feedback && (
        <div
          className={`p-4 rounded-lg mb-4 ${
            feedback.isCorrect
              ? 'bg-green-100 border border-green-400'
              : 'bg-red-100 border border-red-400'
          }`}
        >
          <p
            className={`font-semibold mb-2 ${
              feedback.isCorrect ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {feedback.isCorrect ? t.quiz.correct : t.quiz.incorrect}
          </p>
          {!feedback.isCorrect && (
            <div className="text-sm text-red-700 space-y-1">
              {feedback.selectedAnswerName && (
                <p>
                  <span className="font-medium">You selected:</span> {feedback.selectedAnswerName}
                </p>
              )}
              {feedback.correctAnswerName && (
                <p>
                  <span className="font-medium">Correct answer:</span> {feedback.correctAnswerName}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-500 text-center">
        {feedback
          ? 'Click on the map to continue...'
          : 'Click on the map to answer'}
      </div>
    </div>
  );
};
