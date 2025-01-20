import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Login = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-quiz-background to-white p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-quiz-text mb-2">Welcome to Quizzy Bucks</h1>
          <p className="text-gray-600">Sign in to start earning rewards!</p>
        </div>
        
        <div className="mt-8">
          <Button
            onClick={signIn}
            className="w-full bg-quiz-primary hover:bg-quiz-secondary text-white"
          >
            <LogIn className="mr-2" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;