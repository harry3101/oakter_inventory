
import React, { useState } from 'react';
import LoginScene from '@/components/login/LoginScene';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail } from 'lucide-react'; // Changed from Google to Mail icon which exists in lucide-react

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google authentication error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      {/* Login Form positioned on the left side */}
      <div className="w-1/2 flex items-center justify-center p-8 z-20">
        <Card className="w-full max-w-md p-6 backdrop-blur-md bg-white/10 text-white rounded-xl shadow-2xl border border-white/20 relative">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-amber-400 mb-2">IT Inventory System</h1>
            <p className="text-slate-300">{isSignUp ? 'Create an account' : 'Sign in to your account'}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4 flex items-center justify-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="mx-4 text-slate-400 text-sm">OR</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full mt-4 bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/70 flex items-center justify-center gap-2"
          >
            <Mail className="h-5 w-5" /> {/* Using Mail icon instead of Google */}
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </Button>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-amber-400 hover:text-amber-300 text-sm"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </Card>
      </div>
      
      {/* 3D Scene positioned on the right side with higher z-index */}
      <div className="w-1/2 h-screen absolute right-0" style={{ zIndex: 1 }}>
        <LoginScene />
      </div>
    </div>
  );
};

export default Login;
