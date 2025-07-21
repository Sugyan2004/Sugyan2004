import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Filter,
  Eye,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Transaction } from '../../types';

// Mock data for agent dashboard
const mockTransactions: Transaction[] = [
  {
    id: '1',
    customerId: 'cust_001',
    agentId: 'agent_001',
    amount: 150.00,
    paymentMethod: 'cashapp',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    customerId: 'cust_002',
    agentId: 'agent_001',
    amount: 75.50,
    paymentMethod: 'venmo',
    status: 'completed',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:45:00Z',
  },
  {
    id: '3',
    customerId: 'cust_003',
    agentId: 'agent_001',
    amount: 200.00,
    paymentMethod: 'chime',
    status: 'completed',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
];

export function AgentDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const stats = {
    todayDeposits: 425.50,
    completedCount: transactions.filter(t => t.status === 'completed').length,
    failedCount: transactions.filter(t => t.status === 'failed').length,
    commission: 42.55,
  };

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' || t.status === filter
  );

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      cashapp: '💰',
      chime: '🏦',
      venmo: '💸',
      stripe: '💳',
      paypal: '🅿️',
      googlepay: '📱',
    };
    return icons[method] || '💳';
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Dashboard</h1>
          <p className="text-gray-600">Manage your assigned transactions and track your performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Deposits</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.todayDeposits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.failedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Commission</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.commission}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search transactions..."
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'completed', 'failed'] as const).map(status => (
                  <Button
                    key={status}
                    variant={filter === status ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Assigned Transactions</h2>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{transaction.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            Customer: {transaction.customerId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {getPaymentMethodIcon(transaction.paymentMethod)}
                          </span>
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {transaction.paymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${transaction.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Transaction Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTransaction(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                  <p className="text-gray-900">#{selectedTransaction.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="text-lg font-bold text-gray-900">${selectedTransaction.amount.toFixed(2)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Method</label>
                  <p className="text-gray-900 capitalize flex items-center">
                    <span className="mr-2">{getPaymentMethodIcon(selectedTransaction.paymentMethod)}</span>
                    {selectedTransaction.paymentMethod}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusColor(selectedTransaction.status)}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                </div>



                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    All deposits are automatically processed. No manual verification required.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}