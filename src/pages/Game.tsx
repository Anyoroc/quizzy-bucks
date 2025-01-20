import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { QuizCard } from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { LogOut, Wallet } from "lucide-react";
import type { Quiz } from "@/types/database";

const Game = () => {
  const { user, signOut } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);

  const { data: quizzes, isLoading } = useQuery({
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

  useEffect(() => {
    const fetchWalletBalance = async () => {
      const { data, error } = await supabase
        .from('user_quiz_attempts')
        .select('earned_amount')
        .eq('user_id', user?.id);

      if (!error && data) {
        const total = data.reduce((sum, attempt) => sum + attempt.earned_amount, 0);
        setWalletBalance(total);
      }
    };

    if (user) {
      fetchWalletBalance();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-background to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-quiz-text">
            Quizzy Bucks
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-md">
              <Wallet className="text-quiz-primary" />
              <span className="font-bold text-quiz-text">₹{walletBalance}</span>
            </div>
            <Button onClick={signOut} variant="outline" className="gap-2">
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            Loading quizzes...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes?.map((quiz) => (
              <QuizCard
                key={quiz.id}
                title={quiz.title}
                description={quiz.description}
                reward={`₹${quiz.reward_amount}`}
                timeLimit={`${quiz.time_limit} mins`}
                onStart={() => {
                  // Quiz start logic will be implemented later
                  console.log("Starting quiz:", quiz.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;