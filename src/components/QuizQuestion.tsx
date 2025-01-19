import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Option {
  id: string;
  text: string;
}

interface QuizQuestionProps {
  question: string;
  options: Option[];
  timeLeft: number;
  totalTime: number;
  onAnswer: (optionId: string) => void;
}

export function QuizQuestion({ question, options, timeLeft, totalTime, onAnswer }: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const progress = (timeLeft / totalTime) * 100;

  return (
    <Card className="w-full max-w-2xl bg-white shadow-lg animate-fade-in">
      <CardHeader className="space-y-4">
        <Progress value={progress} className="h-2" />
        <CardTitle className="text-xl font-bold text-quiz-text text-center">
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className={`w-full p-4 text-left justify-start h-auto ${
                selectedOption === option.id
                  ? "border-quiz-primary bg-quiz-background"
                  : "hover:border-quiz-primary hover:bg-quiz-background"
              }`}
              onClick={() => {
                setSelectedOption(option.id);
                onAnswer(option.id);
              }}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}