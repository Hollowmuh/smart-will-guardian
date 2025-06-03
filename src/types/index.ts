
// Core TypeScript interfaces for Smart Will application

export interface User {
  address: string;
  displayName?: string;
  isAuthenticated: boolean;
}

export interface Beneficiary {
  id: string;
  name?: string;
  walletAddress: string;
  email?: string;
  percentage: number;
}

export interface Will {
  id?: string;
  creatorAddress: string;
  beneficiaries: Beneficiary[];
  overridePasswordHash: string;
  proofOfLifeInterval: number; // in months
  lastCheckIn?: Date;
  nextCheckInDue?: Date;
  contractAddress?: string;
  status: 'draft' | 'deployed' | 'active' | 'executed';
  createdAt: Date;
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: any;
}

export interface FormData {
  beneficiaries: Beneficiary[];
  overridePassword: string;
  confirmPassword: string;
  acknowledgeRisks: boolean;
}
