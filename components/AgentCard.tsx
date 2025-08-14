
import React from 'react';
import { Agent } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import { EditIcon } from '../constants';

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
  onAssignStrategy: () => void;
  onEdit: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, isSelected, onSelect, onAssignStrategy, onEdit }) => {
  const pnlColor = agent.pnl > 0 ? 'text-green-400' : agent.pnl < 0 ? 'text-red-400' : 'text-gray-400';
  const statusColor = agent.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500';

  return (
    <Card 
      onClick={onSelect} 
      className={`cursor-pointer transition-all duration-200 relative ${isSelected ? 'border-indigo-500 scale-105' : 'border-gray-700 hover:border-gray-600'}`}
    >
        <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }} 
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors z-10 rounded-full hover:bg-gray-700"
            aria-label="Edit Agent"
        >
            <EditIcon />
        </button>
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img src={agent.avatarUrl} alt={agent.name} className="w-16 h-16 rounded-full border-2 border-gray-600" />
          <div className="flex-1">
            <h3 className="text-lg font-bold">{agent.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className={`h-2 w-2 rounded-full ${statusColor}`}></span>
              <span>{agent.status}</span>
            </div>
            <p className="text-sm text-gray-500">Balance: ${agent.balance.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">P&L</p>
            <p className={`text-xl font-semibold ${pnlColor}`}>
              {agent.pnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
          </div>
        </div>
        {agent.status === 'Idle' && (
          <div className="mt-4">
            <Button onClick={(e) => { e.stopPropagation(); onAssignStrategy(); }} className="w-full" variant="secondary">
              Assign Strategy
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AgentCard;
