import { useState } from "react";
import { QuizCard } from "@/components/QuizCard";
import { QuizQuestion } from "@/components/QuizQuestion";
import { useToast } from "@/hooks/use-toast";

// Mock quiz data
const mockQuiz = {
  title: "General Knowledge Quiz",
  description: "Test your knowledge and win rewards! Answer 10 questions correctly to earn points.",
  reward: "₹100",
  timeLimit: "5 mins",
  questions: [
    {
      id: "1",
      text: "What is the capital of France?",
      options: [
        { id: "a", text: "London" },
        { id: "b", text: "Berlin" },
        { id: "c", text: "Paris" },
        { id: "d", text: "Madrid" },
      ],
      correctAnswer: "c",
    },
    // Add more questions here
  ],
};

const Index = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const { toast } = useToast();

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    toast({
      title: "Quiz Started!",
      description: "Good luck! Answer carefully and watch the timer.",
    });
  };

  const handleAnswer = (optionId: string) => {
    const isCorrect = optionId === mockQuiz.questions[currentQuestionIndex].correctAnswer;
    
    toast({
      title: isCorrect ? "Correct!" : "Wrong answer",
      description: isCorrect ? "Well done! Keep going!" : "Better luck on the next question!",
      variant: isCorrect ? "default" : "destructive",
    });

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < mockQuiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(30);
      } else {
        setIsQuizStarted(false);
        toast({
          title: "Quiz Completed!",
          description: "Check your results in the dashboard.",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-background to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-quiz-text text-center mb-8">
          Kimi Quiz App
        </h1>
        <div className="flex justify-center items-center">
          {!isQuizStarted ? (
            <QuizCard
              title={mockQuiz.title}
              description={mockQuiz.description}
              reward={mockQuiz.reward}
              timeLimit={mockQuiz.timeLimit}
              onStart={handleStartQuiz}
            />
          ) : (
            <QuizQuestion
              question={mockQuiz.questions[currentQuestionIndex].text}
              options={mockQuiz.questions[currentQuestionIndex].options}
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