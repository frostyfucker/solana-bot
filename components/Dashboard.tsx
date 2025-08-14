
import React, { useState } from 'react';
import { Agent } from '../types';
import AgentCard from './AgentCard';
import Button from './ui/Button';
import ProfitChart from './ProfitChart';
import { PlusIcon } from '../constants';
import Card from './ui/Card';

interface DashboardProps {
  agents: Agent[];
  onOpenCreateModal: () => void;
  onOpenAssignModal: (agentId: string) => void;
  onOpenEditModal: (agentId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ agents, onOpenCreateModal, onOpenAssignModal, onOpenEditModal }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || (agents.length > 0 ? agents[0] : null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">My Agents</h2>
          <Button onClick={onOpenCreateModal}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
            {agents.length === 0 && (
                <Card className="text-center p-8">
                    <p className="text-gray-400">No agents found.</p>
                    <p className="text-gray-400">Create one to get started!</p>
                </Card>
            )}
            {agents.map(agent => (
                <AgentCard
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgent?.id === agent.id}
                    onSelect={() => setSelectedAgentId(agent.id)}
                    onAssignStrategy={() => onOpenAssignModal(agent.id)}
                    onEdit={() => onOpenEditModal(agent.id)}
                />
            ))}
        </div>
      </div>
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-6">Performance</h2>
        {selectedAgent ? (
          <ProfitChart agent={selectedAgent} />
        ) : (
          <Card className="h-[480px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>No agent selected.</p>
              <p>Create or select an agent to view performance data.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
