import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { PaymentMethod } from '../../types';
import { PaymentIntegration } from './PaymentIntegration';

interface DepositFormData {
  amount: number;
  paymentMethod: PaymentMethod;
}

export function DepositForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<DepositFormData>();
  const selectedMethod = watch('paymentMethod');
  const selectedAmount = watch('amount');

  const paymentMethods = [
    { id: 'cashapp', name: 'Cash App', icon: '💰', color: 'bg-green-100 text-green-800' },
    { id: 'chime', name: 'Chime', icon: '🏦', color: 'bg-blue-100 text-blue-800' },
    { id: 'venmo', name: 'Venmo', icon: '💸', color: 'bg-purple-100 text-purple-800' },
    { id: 'stripe', name: 'Stripe Account', icon: '💳', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', color: 'bg-blue-100 text-blue-800' },
    { id: 'googlepay', name: 'Google Pay', icon: '📱', color: 'bg-red-100 text-red-800' },
  ];


  const onSubmit = async (data: DepositFormData) => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId);
    setShowSuccess(true);
    setShowPayment(false);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    alert('Payment failed: ' + error);
    setShowPayment(false);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Deposit Successful!</h2>
              <p className="text-gray-600 mb-8">
                Your deposit of ${selectedAmount} has been processed successfully. 
                Your balance has been updated and you can start playing immediately.
              </p>
              
              <div className="space-y-4">
                <Button onClick={() => window.location.reload()} className="w-full">
                  Make Another Deposit
                </Button>
                <Link to="/history">
                  <Button variant="outline" className="w-full">
                    View Deposit History
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showPayment && selectedAmount && selectedMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setShowPayment(false)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deposit Form
          </button>

          <PaymentIntegration
            method={selectedMethod}
            amount={selectedAmount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Make a Deposit</h1>
                <p className="text-gray-600">Choose your payment method and deposit amount</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Deposit Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="10000"
                    {...register('amount', { 
                      required: 'Amount is required',
                      min: { value: 1, message: 'Minimum deposit is $1' },
                      max: { value: 10000, message: 'Maximum deposit is $10,000' }
                    })}
                    className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {[].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                        if (input) input.value = amount.toString();
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map(method => (
                    <label key={method.id} className="relative cursor-pointer">
                      <input
                        type="radio"
                        value={method.id}
                        {...register('paymentMethod', { required: 'Please select a payment method' })}
                        className="sr-only peer"
                      />
                      <div className="border-2 border-gray-200 rounded-lg p-4 peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-gray-300 transition-all">
                    <div className="border-2 border-gray-200 rounded-lg p-4 peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-gray-300 hover:shadow-md transition-all">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{method.name}</h3>
                          </div>
                          <p className="text-xs text-gray-500">Instant payment</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
                )}
              </div>


              {/* Submit */}
              <div className="pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                  disabled={!selectedAmount || !selectedMethod}
                >
                  {isSubmitting ? 'Processing...' : `Continue to Secure Payment - $${selectedAmount || '0'}`}
                </Button>
                <p className="mt-3 text-sm text-gray-500 text-center">
                  🔒 Secure payment processing • Your money goes directly to our account
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}