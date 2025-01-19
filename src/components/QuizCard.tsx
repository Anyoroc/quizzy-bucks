import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Trophy } from "lucide-react";

interface QuizCardProps {
  title: string;
  description: string;
  reward: string;
  timeLimit: string;
  onStart: () => void;
}

export function QuizCard({ title, description, reward, timeLimit, onStart }: QuizCardProps) {
  return (
    <Card className="w-full max-w-md bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-quiz-text">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">{description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Trophy size={16} className="text-quiz-primary" />
            <span>Reward: {reward}</span>
          </div>
          <div className="flex items-center gap-1">
            <Timer size={16} className="text-quiz-secondary" />
            <span>{timeLimit}</span>
          </div>
        </div>
        <Button 
          onClick={onStart}
          className="w-full bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:opacity-90 text-white"
        >
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
}