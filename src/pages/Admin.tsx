import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen, History } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .single();
      
      return !!adminUser;
    },
  });

  useEffect(() => {
    if (!checkingAdmin && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, checkingAdmin, navigate, toast]);

  if (checkingAdmin) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  const adminActions = [
    {
      title: "Manage Quizzes",
      description: "Create and edit quizzes and questions",
      icon: BookOpen,
      action: () => navigate("/admin/quizzes"),
    },
    {
      title: "User Management",
      description: "View and manage user accounts",
      icon: Users,
      action: () => navigate("/admin/users"),
    },
    {
      title: "Quiz Attempts",
      description: "View quiz attempt history",
      icon: History,
      action: () => navigate("/admin/attempts"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-background to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-quiz-text">Admin Dashboard</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Game
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action) => (
            <Card key={action.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <action.icon className="h-5 w-5" />
                  {action.title}
                </CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={action.action} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Manage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;