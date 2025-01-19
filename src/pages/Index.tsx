import { useState } from "react";
import { QuizCard } from "@/components/QuizCard";
import { QuizQuestion } from "@/components/QuizQuestion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Quiz, Question } from "@/types/database";

const Index = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const { user, signIn, signOut } = useAuth();
  const { toast } = useToast();

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
    queryKey: ['questions', selectedQuizId],
    queryFn: async () => {
      if (!selectedQuizId) return null;
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', selectedQuizId);
      
      if (error) throw error;
      return data as Question[];
    },
    enabled: !!selectedQuizId,
  });

  const handleStartQuiz = (quizId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start the quiz",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedQuizId(quizId);
    setIsQuizStarted(true);
    toast({
      title: "Quiz Started!",
      description: "Good luck! Answer carefully and watch the timer.",
    });
  };

  const handleAnswer = async (optionId: string) => {
    if (!questions || !selectedQuizId) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = parseInt(optionId) === currentQuestion.correct_option;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30);
    } else {
      // Quiz completed
      const { error } = await supabase
        .from('user_quiz_attempts')
        .insert({
          user_id: user?.id,
          quiz_id: selectedQuizId,
          score: isCorrect ? 1 : 0,
          earned_amount: isCorrect ? (quizzes?.find(q => q.id === selectedQuizId)?.reward_amount || 0) : 0,
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save quiz results",
          variant: "destructive",
        });
        return;
      }

      setIsQuizStarted(false);
      setCurrentQuestionIndex(0);
      setSelectedQuizId(null);
      
      toast({
        title: "Quiz Completed!",
        description: isCorrect ? "Congratulations! Your reward has been added to your wallet." : "Better luck next time!",
      });
    }
  };

  if (isLoadingQuizzes) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-background to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-quiz-text">
            Kimi Quiz App
          </h1>
          {user ? (
            <Button onClick={() => signOut()} variant="outline">
              Sign Out
            </Button>
          ) : (
            <Button onClick={() => signIn()} className="bg-quiz-primary text-white">
              Sign In with Google
            </Button>
          )}
        </div>
        
        <div className="flex justify-center items-center">
          {!isQuizStarted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes?.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  title={quiz.title}
                  description={quiz.description}
                  reward={`₹${quiz.reward_amount}`}
                  timeLimit={`${quiz.time_limit} mins`}
                  onStart={() => handleStartQuiz(quiz.id)}
                />
              ))}
            </div>
          ) : (
            questions && questions[currentQuestionIndex] && (
              <QuizQuestion
                question={questions[currentQuestionIndex].text}
                options={questions[currentQuestionIndex].options}
                timeLeft={timeLeft}
                totalTime={30}
                onAnswer={handleAnswer}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;