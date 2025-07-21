import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password, role || undefined);
    if (success) {
      const redirectPath = role === 'admin' ? '/admin' : role === 'agent' ? '/agent' : '/deposit';
      navigate(redirectPath);
    } else {
      setError('Invalid credentials. Contact administrator for login details.');
    }
  };

  const getDemoCredentials = () => {
    if (role === 'admin') {
      return { email: 'admin@eazypay.com', password: 'adminpass456' };
    } else if (role === 'agent') {
      return { email: 'agent@eazypay.com', password: 'agentpass789' };
    } else {
      return { email: 'customer@eazypay.com', password: 'newpassword123' };
    }
  };

  const fillDemoCredentials = () => {
    const creds = getDemoCredentials();
    setEmail(creds.email);
    setPassword(creds.password);
  };

  const getTitle = () => {
    if (role === 'admin') return 'Admin Login';
    if (role === 'agent') return 'Agent Login';
    return 'Customer Login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CreditCard className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Use Demo Credentials
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">Quick Access:</p>
                <div className="flex flex-col space-y-2">
                  <Link to="/login?role=admin" className="text-blue-600 hover:text-blue-700">
                    Admin Dashboard
                  </Link>
                  <Link to="/login?role=agent" className="text-blue-600 hover:text-blue-700">
                    Agent Login
                  </Link>
                  <Link to="/deposit" className="text-blue-600 hover:text-blue-700">
                    Customer Deposit
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}