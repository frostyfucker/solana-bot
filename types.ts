
export interface PnlData {
  time: number;
  value: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Agent {
  id: string;
  name:string;
  avatarUrl: string;
  balance: number;
  status: 'Idle' | 'Active' | 'Error';
  pnl: number;
  pnlHistory: PnlData[];
  strategy: Strategy | null;
}