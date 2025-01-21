import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/play");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-background to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Login Button */}
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-quiz-text">Quizzy Bucks</h1>
          <Button 
            onClick={() => navigate("/login")}
            className="bg-quiz-primary hover:bg-quiz-primary/90 text-white"
          >
            Login to Play
          </Button>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-quiz-text mb-4">
            Test Your Knowledge, Earn Rewards!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our quiz platform where learning meets rewards. Challenge yourself with exciting quizzes and win amazing prizes!
          </p>
          <Button 
            onClick={() => navigate("/login")}
            size="lg"
            className="bg-quiz-secondary hover:bg-quiz-secondary/90 text-white"
          >
            Get Started
          </Button>
        </section>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-quiz-text mb-3">Diverse Quiz Categories</h3>
            <p className="text-gray-600">
              From general knowledge to specific topics, find quizzes that match your interests.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-quiz-text mb-3">Real Rewards</h3>
            <p className="text-gray-600">
              Convert your knowledge into rewards. Each correct answer brings you closer to winning!
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-quiz-text mb-3">Learn & Earn</h3>
            <p className="text-gray-600">
              Enhance your knowledge while earning rewards. It's a win-win situation!
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-quiz-text mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-quiz-primary rounded-full flex items-center justify-center text-white font-bold mb-4">1</div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your free account</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-quiz-primary rounded-full flex items-center justify-center text-white font-bold mb-4">2</div>
              <h3 className="font-semibold mb-2">Choose Quiz</h3>
              <p className="text-gray-600">Select from various categories</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-quiz-primary rounded-full flex items-center justify-center text-white font-bold mb-4">3</div>
              <h3 className="font-semibold mb-2">Answer Questions</h3>
              <p className="text-gray-600">Complete the quiz challenges</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-quiz-primary rounded-full flex items-center justify-center text-white font-bold mb-4">4</div>
              <h3 className="font-semibold mb-2">Earn Rewards</h3>
              <p className="text-gray-600">Get rewarded for correct answers</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-600 py-8 border-t">
          <p>&copy; 2024 Quizzy Bucks. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;