import { create } from 'zustand';

export interface QuizQuestion {
  id: string;
  nameEn: string;
  nameFi: string;
}

export interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  timeTaken?: number;
}

interface QuizState {
  isQuizActive: boolean;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  results: QuizResult[];
  startQuiz: (questions: QuizQuestion[]) => void;
  answerQuestion: (isCorrect: boolean) => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  getCurrentQuestion: () => QuizQuestion | null;
}

export const useQuizStore = create<QuizState>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (set: any, get: any) => ({
  isQuizActive: false,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  results: [],

  startQuiz: (questions: QuizQuestion[]) => {
    set({
      isQuizActive: true,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      results: [],
    });
  },

  answerQuestion: (isCorrect: boolean) => {
    const state = get();
    const currentQuestion = state.questions[state.currentQuestionIndex];

    if (!currentQuestion) return;

    const newScore = isCorrect ? state.score + 1 : state.score;
    const newResults = [
      ...state.results,
      {
        questionId: currentQuestion.id,
        isCorrect,
      },
    ];

    set({
      score: newScore,
      results: newResults,
    });
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentQuestionIndex + 1;

    if (nextIndex >= state.questions.length) {
      state.endQuiz();
    } else {
      set({ currentQuestionIndex: nextIndex });
    }
  },

  endQuiz: () => {
    set({
      isQuizActive: false,
    });
  },

  getCurrentQuestion: () => {
    const state = get();
    return state.questions[state.currentQuestionIndex] || null;
  },
}));
