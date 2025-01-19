export interface User {
  id: string;
  email: string;
  name: string;
  wallet_balance: number;
  referral_code: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  reward_amount: number;
  time_limit: number;
  created_at: string;
  is_active: boolean;
}

export interface Question {
  id: string;
  quiz_id: string;
  text: string;
  options: string[];
  correct_option: number;
  created_at: string;
}

export interface UserQuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  earned_amount: number;
  completed_at: string;
}