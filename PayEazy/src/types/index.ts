export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'agent' | 'admin';
  createdAt: string;
  balance?: number;
  commission?: number;
  winnings?: number;
  totalDeposits?: number;
  pendingPayout?: number;
}

export interface Agent extends User {
  role: 'agent';
  assignedMethods: PaymentMethod[];
  totalCommission: number;
  isActive: boolean;
}

export interface Customer extends User {
  role: 'customer';
  totalDeposits: number;
  winnings: number;
  pendingPayout: number;
  lastActivity: string;
}

export interface Payout {
  id: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: PaymentMethod;
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}
export interface Transaction {
  id: string;
  customerId: string;
  agentId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export type PaymentMethod = 'cashapp' | 'chime' | 'venmo' | 'stripe' | 'paypal' | 'googlepay';

export interface DashboardStats {
  totalRevenue: number;
  pendingTransactions: number;
  verifiedTransactions: number;
  totalAgents: number;
  todayDeposits: number;
  monthlyGrowth: number;
}