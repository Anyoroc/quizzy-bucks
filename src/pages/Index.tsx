import { useState } from "react";
import { QuizCard } from "@/components/QuizCard";
import { QuizQuestion } from "@/components/QuizQuestion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const { user, signIn, signOut } = useAuth();
  const { toast } = useToast();

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  const handleStartQuiz = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start the quiz",
        variant: "destructive",
      });
      return;
    }
    
    setIsQuizStarted(true);
    toast({
      title: "Quiz Started!",
      description: "Good luck! Answer carefully and watch the timer.",
    });
  };

  const handleAnswer = async (optionId: string) => {
    // Implementation for handling answers will be added later
    toast({
      title: "Answer recorded!",
      description: "Moving to the next question...",
    });
  };

  if (isLoading) {
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
                  onStart={handleStartQuiz}
                />
              ))}
            </div>
          ) : (
            <QuizQuestion
              question="What is the capital of France?"
              options={[
                { id: "a", text: "London" },
                { id: "b", text: "Berlin" },
                { id: "c", text: "Paris" },
                { id: "d", text: "Madrid" },
              ]}
              timeLeft={timeLeft}
              totalTime={30}
              onAnswer={handleAnswer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;