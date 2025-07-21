import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Transaction, Agent, DashboardStats, Customer, Payout } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

// Mock data
const mockStats: DashboardStats = {
  totalRevenue: 45720.50,
  pendingTransactions: 0,
  verifiedTransactions: 168,
  totalAgents: 8,
  todayDeposits: 3240.75,
  monthlyGrowth: 23.5,
};

const mockCustomers: Customer[] = [
  {
    id: '1',
    email: 'customer1@example.com',
    name: 'John Smith',
    role: 'customer',
    createdAt: '2024-01-01T00:00:00Z',
    totalDeposits: 2500.00,
    winnings: 3200.00,
    pendingPayout: 700.00,
    lastActivity: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    email: 'customer2@example.com',
    name: 'Sarah Johnson',
    role: 'customer',
    createdAt: '2024-01-02T00:00:00Z',
    totalDeposits: 1800.00,
    winnings: 2100.00,
    pendingPayout: 300.00,
    lastActivity: '2024-01-15T12:15:00Z',
  },
  {
    id: '3',
    email: 'customer3@example.com',
    name: 'Mike Davis',
    role: 'customer',
    createdAt: '2024-01-03T00:00:00Z',
    totalDeposits: 3200.00,
    winnings: 2800.00,
    pendingPayout: 0.00,
    lastActivity: '2024-01-15T16:45:00Z',
  },
];

const mockPayouts: Payout[] = [
  {
    id: '1',
    customerId: '1',
    amount: 700.00,
    status: 'pending',
    paymentMethod: 'cashapp',
    requestedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    customerId: '2',
    amount: 300.00,
    status: 'processing',
    paymentMethod: 'venmo',
    requestedAt: '2024-01-15T08:30:00Z',
  },
];

const mockAgents: Agent[] = [
  {
    id: '1',
    email: 'agent1@platform.com',
    name: 'John Agent',
    role: 'agent',
    createdAt: '2024-01-01T00:00:00Z',
    assignedMethods: ['cashapp', 'venmo'],
    totalCommission: 1250.50,
    isActive: true,
  },
  {
    id: '2',
    email: 'agent2@platform.com',
    name: 'Sarah Agent',
    role: 'agent',
    createdAt: '2024-01-02T00:00:00Z',
    assignedMethods: ['chime', 'paypal'],
    totalCommission: 980.25,
    isActive: true,
  },
];

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
    agentId: 'agent_002',
    amount: 75.50,
    paymentMethod: 'venmo',
    status: 'completed',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:45:00Z',
  },
];

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
];

const paymentMethodData = [
  { name: 'Cash App', value: 35, color: '#10B981' },
  { name: 'Venmo', value: 25, color: '#8B5CF6' },
  { name: 'Stripe', value: 20, color: '#3B82F6' },
  { name: 'PayPal', value: 15, color: '#F59E0B' },
  { name: 'Other', value: 5, color: '#6B7280' },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'agents' | 'payouts' | 'reports'>('overview');
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<string>('');
  const [showAddAgent, setShowAddAgent] = useState(false);

  const TabButton = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  const handlePayoutAction = (payoutId: string, action: 'approve' | 'reject') => {
    setPayouts(prev => prev.map(p => 
      p.id === payoutId 
        ? { ...p, status: action === 'approve' ? 'processing' : 'failed' }
        : p
    ));
  };

  const handleCreatePayout = () => {
    if (!selectedCustomer || !payoutAmount || !payoutMethod) return;
    
    const newPayout: Payout = {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      amount: parseFloat(payoutAmount),
      status: 'pending',
      paymentMethod: payoutMethod as any,
      requestedAt: new Date().toISOString(),
    };
    
    setPayouts(prev => [newPayout, ...prev]);
    setShowPayoutModal(false);
    setPayoutAmount('');
    setPayoutMethod('');
    setSelectedCustomer(null);
  };

  const totalPendingPayouts = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCustomerWinnings = customers.reduce((sum, c) => sum + c.winnings, 0);
  const totalCustomerDeposits = customers.reduce((sum, c) => sum + c.totalDeposits, 0);
  const netProfit = totalCustomerDeposits - totalCustomerWinnings;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Complete overview and control of your deposit platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
          <TabButton id="overview" label="Overview" icon={<BarChart3 className="h-4 w-4" />} />
          <TabButton id="transactions" label="Transactions" icon={<Activity className="h-4 w-4" />} />
          <TabButton id="agents" label="Agents" icon={<Users className="h-4 w-4" />} />
          <TabButton id="payouts" label="Customer Payouts" icon={<CreditCard className="h-4 w-4" />} />
          <TabButton id="reports" label="Reports" icon={<PieChart className="h-4 w-4" />} />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <ArrowUpRight className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Deposits</p>
                      <p className="text-2xl font-bold text-gray-900">${totalCustomerDeposits.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <ArrowDownRight className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Winnings</p>
                      <p className="text-2xl font-bold text-gray-900">${totalCustomerWinnings.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Net Profit</p>
                      <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        ${netProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <CreditCard className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                      <p className="text-2xl font-bold text-gray-900">${totalPendingPayouts.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                <Input placeholder="Search transactions..." className="w-64" />
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{transaction.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.customerId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.agentId || 'Auto'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${transaction.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {transaction.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={transaction.status === 'completed' ? 'success' : 'danger'}>
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button size="sm" variant="ghost">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Agent Management</h3>
              <Button onClick={() => setShowAddAgent(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                        <p className="text-sm text-gray-500">{agent.email}</p>
                      </div>
                      <Badge variant={agent.isActive ? 'success' : 'danger'}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Commission:</span>
                        <span className="font-medium">${agent.totalCommission}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Methods: </span>
                        <span className="font-medium capitalize">
                          {agent.assignedMethods.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Customer Payouts Tab */}
        {activeTab === 'payouts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Customer Payout Management</h3>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export Payouts
                </Button>
              </div>
            </div>

            {/* Customer Overview */}
            <Card>
              <CardHeader>
                <h4 className="font-semibold text-gray-900">Customer Financial Overview</h4>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Deposits</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Winnings</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending Payout</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map((customer) => {
                        const netPosition = customer.winnings - customer.totalDeposits;
                        return (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                              ${customer.totalDeposits.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              ${customer.winnings.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                              <span className={netPosition >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                ${netPosition.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600">
                              ${customer.pendingPayout.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedCustomer(customer)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {netPosition > 0 && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => {
                                      setSelectedCustomer(customer);
                                      setShowPayoutModal(true);
                                    }}
                                  >
                                    Create Payout
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pending Payouts */}
            <Card>
              <CardHeader>
                <h4 className="font-semibold text-gray-900">Pending Payouts</h4>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payouts.map((payout) => {
                        const customer = customers.find(c => c.id === payout.customerId);
                        return (
                          <tr key={payout.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{customer?.name}</div>
                              <div className="text-sm text-gray-500">{customer?.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              ${payout.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                              {payout.paymentMethod}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={getStatusColor(payout.status)}>
                                {payout.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(payout.requestedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {payout.status === 'pending' && (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handlePayoutAction(payout.id, 'approve')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handlePayoutAction(payout.id, 'reject')}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Reports & Analytics</h3>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h4 className="font-semibold text-gray-900">Daily Deposit Summary</h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Deposits Today:</span>
                      <span className="font-bold">${mockStats.todayDeposits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified:</span>
                      <span className="text-emerald-600 font-medium">${(mockStats.todayDeposits * 0.8).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pending:</span>
                      <span className="text-amber-600 font-medium">${(mockStats.todayDeposits * 0.2).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className="font-semibold text-gray-900">Agent Performance</h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{agent.name}</span>
                        <span className="text-sm font-medium">${agent.totalCommission}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Customer Details Modal */}
        {selectedCustomer && !showPayoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900 font-medium">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Deposits</label>
                    <p className="text-lg font-bold text-emerald-600">${selectedCustomer.totalDeposits.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Winnings</label>
                    <p className="text-lg font-bold text-blue-600">${selectedCustomer.winnings.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pending Payout</label>
                    <p className="text-lg font-bold text-amber-600">${selectedCustomer.pendingPayout.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Net Position</label>
                    <p className={`text-lg font-bold ${(selectedCustomer.winnings - selectedCustomer.totalDeposits) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ${(selectedCustomer.winnings - selectedCustomer.totalDeposits).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="flex space-x-3">
                    {(selectedCustomer.winnings - selectedCustomer.totalDeposits) > 0 && (
                      <Button 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => setShowPayoutModal(true)}
                      >
                        Create Payout
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1">
                      View History
                    </Button>
                    <Button variant="ghost" className="flex-1">
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Payout Modal */}
        {showPayoutModal && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Create Payout</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowPayoutModal(false);
                      setSelectedCustomer(null);
                      setPayoutAmount('');
                      setPayoutMethod('');
                    }}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Customer</label>
                  <p className="text-gray-900 font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-500">Available to payout: ${(selectedCustomer.winnings - selectedCustomer.totalDeposits).toFixed(2)}</p>
                </div>

                <Input
                  label="Payout Amount"
                  type="number"
                  step="0.01"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                  max={selectedCustomer.winnings - selectedCustomer.totalDeposits}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="cashapp">Cash App</option>
                    <option value="chime">Chime</option>
                    <option value="venmo">Venmo</option>
                    <option value="paypal">PayPal</option>
                    <option value="googlepay">Google Pay</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowPayoutModal(false);
                      setSelectedCustomer(null);
                      setPayoutAmount('');
                      setPayoutMethod('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleCreatePayout}
                    disabled={!payoutAmount || !payoutMethod || parseFloat(payoutAmount) <= 0}
                  >
                    Create Payout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}