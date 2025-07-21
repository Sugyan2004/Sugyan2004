import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Shield, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

export function LandingPage() {
  const paymentMethods = [
    { name: 'Cash App', icon: '💰' },
    { name: 'Chime', icon: '🏦' },
    { name: 'Venmo', icon: '💸' },
    { name: 'Stripe', icon: '💳' },
    { name: 'PayPal', icon: '🅿️' },
    { name: 'Google Pay', icon: '📱' },
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: 'Bank-Level Security',
      description: 'Your transactions are protected with enterprise-grade encryption and security protocols.',
    },
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: 'Instant Processing',
      description: 'Most deposits are processed instantly with automatic verification for supported methods.',
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: '24/7 Support',
      description: 'Our dedicated support team is available around the clock to assist with your deposits.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PayEazy</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/deposit">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Deposit to Play
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Secure, fast, and reliable deposits across multiple payment platforms. 
            Start playing with just a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/deposit">
              <Button size="lg" className="w-full sm:w-auto">
                Make a Deposit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Agent Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Supported Payment Methods</h2>
            <p className="text-lg text-gray-600">Choose from a variety of trusted payment platforms</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {paymentMethods.map((method, index) => (
              <Card key={index} hover className="p-6 text-center">
                <div className="text-3xl mb-3">{method.icon}</div>
                <h3 className="font-semibold text-gray-900">{method.name}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EazyPay?</h2>
            <p className="text-lg text-gray-600">Built for security, speed, and reliability</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to start depositing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Amount</h3>
              <p className="text-gray-600">Enter the deposit amount and select your preferred payment method.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Payment</h3>
              <p className="text-gray-600">Complete payment through your chosen platform or upload proof of payment.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Playing</h3>
              <p className="text-gray-600">Once verified, your balance is updated and you're ready to play!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-6 w-6" />
                <span className="text-lg font-bold">PayEazy</span>
              </div>
              <p className="text-gray-400">Secure deposit platform for seamless transactions.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/deposit" className="hover:text-white transition-colors">Make Deposit</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Agent Portal</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EazyPay. All rights reserved.</p>
            <p>&copy; 2024 PayEazy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}