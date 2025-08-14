
import React, { useState, useEffect } from 'react';
import { Agent, Strategy } from './types';
import { generateUniqueId, MOCK_STRATEGIES } from './constants';
import Header from './components/Header';
import ConnectWallet from './components/ConnectWallet';
import Dashboard from './components/Dashboard';
import CreateAgentModal from './components/CreateAgentModal';
import AssignStrategyModal from './components/AssignStrategyModal';
import EditAgentModal from './components/EditAgentModal';
import { startTrading, stopTrading } from './services/tradingService';

export default function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState<string | null>(null); // Holds agentId
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  
  const handleConnectWallet = () => {
    const mockAddress = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setWalletAddress(mockAddress);
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
    setAgents([]);
  };

  const handleCreateAgent = (name: string, balance: number) => {
    const newAgent: Agent = {
      id: generateUniqueId(),
      name,
      balance,
      status: 'Idle',
      pnl: 0,
      pnlHistory: [{ time: Date.now(), value: 0 }],
      strategy: null,
      avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`
    };
    setAgents(prev => [...prev, newAgent]);
    setCreateModalOpen(false);
  };

  const handleEditAgent = (agentId: string, name: string, balance: number, avatarUrl: string) => {
    const agentToUpdate = agents.find(a => a.id === agentId);
    if (!agentToUpdate) return;

    if (agentToUpdate.status === 'Active') {
      stopTrading(agentId);
    }

    setAgents(prev =>
      prev.map(agent => {
        if (agent.id === agentId) {
          const updatedAgent = { 
            ...agent, 
            name, 
            balance, 
            avatarUrl,
            // Reset P&L and history on edit for a clean slate
            pnl: 0,
            pnlHistory: [{ time: Date.now(), value: 0 }],
          };
          
          if (updatedAgent.status === 'Active') {
            startTrading(updatedAgent, (pnl, pnlHistory) => {
              setAgents(currentAgents =>
                currentAgents.map(a =>
                  a.id === agentId ? { ...a, pnl, pnlHistory: [...a.pnlHistory.slice(-99), ...pnlHistory] } : a
                )
              );
            });
          }
          return updatedAgent;
        }
        return agent;
      })
    );
    setEditingAgentId(null);
  };

  const handleAssignStrategy = (agentId: string, strategy: Strategy) => {
    setAgents(prev =>
      prev.map(agent => {
        if (agent.id === agentId) {
          stopTrading(agent.id); // Stop any previous simulation
          const updatedAgent = { ...agent, strategy, status: 'Active' as const };
          startTrading(updatedAgent, (pnl, pnlHistory) => {
            setAgents(currentAgents =>
              currentAgents.map(a =>
                a.id === agentId ? { ...a, pnl, pnlHistory: [...a.pnlHistory.slice(-99), ...pnlHistory] } : a
              )
            );
          });
          return updatedAgent;
        }
        return agent;
      })
    );
    setAssignModalOpen(null);
  };
  
  useEffect(() => {
    // Cleanup trading simulations on component unmount
    return () => {
      agents.forEach(agent => stopTrading(agent.id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const agentToAssign = agents.find(a => a.id === isAssignModalOpen);
  const agentToEdit = agents.find(a => a.id === editingAgentId);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/40 via-gray-900 to-gray-900 z-0"></div>
      <div className="relative z-10">
        <Header walletAddress={walletAddress} onDisconnect={handleDisconnectWallet} />
        <main className="container mx-auto px-4 py-8">
          {!walletAddress ? (
            <ConnectWallet onConnect={handleConnectWallet} />
          ) : (
            <Dashboard
              agents={agents}
              onOpenCreateModal={() => setCreateModalOpen(true)}
              onOpenAssignModal={(agentId) => setAssignModalOpen(agentId)}
              onOpenEditModal={(agentId) => setEditingAgentId(agentId)}
            />
          )}
        </main>
        {isCreateModalOpen && (
          <CreateAgentModal
            onClose={() => setCreateModalOpen(false)}
            onCreate={handleCreateAgent}
          />
        )}
        {agentToAssign && (
          <AssignStrategyModal
            agent={agentToAssign}
            strategies={MOCK_STRATEGIES}
            onClose={() => setAssignModalOpen(null)}
            onAssign={handleAssignStrategy}
          />
        )}
        {agentToEdit && (
          <EditAgentModal
            agent={agentToEdit}
            onClose={() => setEditingAgentId(null)}
            onSave={handleEditAgent}
          />
        )}
      </div>
    </div>
  );
}