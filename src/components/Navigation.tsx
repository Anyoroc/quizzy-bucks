import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="fixed top-0 right-0 p-4 flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/profile")}
        className="hover:bg-gray-100"
      >
        <User className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={signOut}
        className="hover:bg-gray-100"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};