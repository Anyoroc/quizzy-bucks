import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuizCard } from "@/components/QuizCard";
import { QuizQuestion } from "@/components/QuizQuestion";
import { useToast } from "@/hooks/use-toast";
import type { Quiz, Question } from "@/types/database";

const Game = () => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data as Quiz[];
    },
  });

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions', activeQuiz?.id],
    queryFn: async () => {
      if (!activeQuiz?.id) return null;
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', activeQuiz.id)
        .limit(activeQuiz.question_count);
      
      if (error) throw error;
      return data as Question[];
    },
    enabled: !!activeQuiz?.id,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeQuiz && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(-1); // Auto-submit on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, timeLeft]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setTimeLeft(quiz.time_limit);
    setCorrectAnswers(0);
  };

  const handleAnswer = async (selectedOption: number) => {
    if (!questions || !activeQuiz || !user) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_option;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    try {
      if (currentQuestionIndex === questions.length - 1) {
        // Quiz completed, record the attempt
        const finalScore = ((correctAnswers + (isCorrect ? 1 : 0)) / questions.length) * 100;
        const earnedAmount = Math.floor((finalScore / 100) * activeQuiz.reward_amount);

        await supabase.from('user_quiz_attempts').insert({
          user_id: user.id,
          quiz_id: activeQuiz.id,
          score: finalScore,
          earned_amount: earnedAmount,
          total_questions: questions.length,
          correct_answers: correctAnswers + (isCorrect ? 1 : 0)
        });

        toast({
          title: "Quiz Completed!",
          description: `You scored ${finalScore}% and earned ₹${earnedAmount}!`,
        });

        setActiveQuiz(null);
        navigate('/profile');
      } else {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(activeQuiz.time_limit);
      }
    } catch (error) {
      console.error('Error recording quiz attempt:', error);
      toast({
        title: "Error",
        description: "Failed to save your answer",
        variant: "destructive",
      });
    }
  };

  if (isLoadingQuizzes) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-background to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-quiz-text mb-8">
          {activeQuiz ? 'Answer the Question' : 'Choose a Quiz Category'}
        </h1>
        
        <div className="flex justify-center items-center">
          {!activeQuiz ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes?.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  title={quiz.title}
                  description={quiz.description}
                  reward={`₹${quiz.reward_amount}`}
                  timeLimit={`${quiz.time_limit} seconds per question`}
                  category={quiz.category}
                  onStart={() => handleStartQuiz(quiz)}
                />
              ))}
            </div>
          ) : (
            questions && questions[currentQuestionIndex] && (
              <div className="w-full max-w-2xl">
                <div className="mb-4 text-center">
                  <p className="text-lg font-medium">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                  <p className="text-sm text-gray-500">
                    Time left: {timeLeft} seconds
                  </p>
                </div>
                <QuizQuestion
                  question={questions[currentQuestionIndex].text}
                  options={questions[currentQuestionIndex].options}
                  timeLeft={timeLeft}
                  totalTime={activeQuiz.time_limit}
                  onAnswer={(optionId) => handleAnswer(parseInt(optionId))}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;