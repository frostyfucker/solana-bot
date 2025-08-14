
import React, { useState } from 'react';
import { Agent, Strategy } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { generateAiStrategy } from '../services/geminiService';
import { SparklesIcon } from '../constants';
import Card from './ui/Card';

interface AssignStrategyModalProps {
  agent: Agent;
  strategies: Strategy[];
  onClose: () => void;
  onAssign: (agentId: string, strategy: Strategy) => void;
}

const AssignStrategyModal: React.FC<AssignStrategyModalProps> = ({ agent, strategies, onClose, onAssign }) => {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<Strategy | null>(null);
  const [error, setError] = useState('');

  const handleGenerateStrategy = async () => {
    if (!customGoal.trim()) {
      setError('Please describe your investment goal.');
      return;
    }
    setError('');
    setIsGenerating(true);
    setGeneratedStrategy(null);
    try {
      const newStrategy = await generateAiStrategy(customGoal);
      setGeneratedStrategy(newStrategy);
      setSelectedStrategyId(newStrategy.id);
    } catch (e) {
      setError('Failed to generate strategy. Please try again.');
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAssign = () => {
    const allStrategies = [...strategies, generatedStrategy].filter(Boolean) as Strategy[];
    const strategyToAssign = allStrategies.find(s => s.id === selectedStrategyId);
    if (strategyToAssign) {
      onAssign(agent.id, strategyToAssign);
    }
  };

  const allStrategies = [...strategies];
  if (generatedStrategy) {
    allStrategies.push(generatedStrategy);
  }

  return (
    <Modal title={`Assign Strategy to ${agent.name}`} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Choose a Predefined Strategy</h3>
          <div className="space-y-3">
            {strategies.map(strategy => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                isSelected={selectedStrategyId === strategy.id}
                onSelect={() => setSelectedStrategyId(strategy.id)}
              />
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <SparklesIcon /> AI Strategy Generator
            </h3>
            <div className="flex flex-col gap-2">
                <input
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="Describe your goal, e.g., 'Aggressive growth with altcoins'"
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button onClick={handleGenerateStrategy} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                </Button>
            </div>
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
            {generatedStrategy && (
                <div className="mt-4">
                    <StrategyCard
                        strategy={generatedStrategy}
                        isSelected={selectedStrategyId === generatedStrategy.id}
                        onSelect={() => setSelectedStrategyId(generatedStrategy.id)}
                    />
                </div>
            )}
        </div>
        
        <div className="mt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAssign} disabled={!selectedStrategyId}>Assign Strategy</Button>
        </div>
      </div>
    </Modal>
  );
};

interface StrategyCardProps {
    strategy: Strategy;
    isSelected: boolean;
    onSelect: () => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, isSelected, onSelect }) => {
    const riskColor = {
        Low: 'bg-green-500/20 text-green-300 border-green-500/30',
        Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        High: 'bg-red-500/20 text-red-300 border-red-500/30',
    }[strategy.riskLevel];

    return (
        <Card
            onClick={onSelect}
            className={`cursor-pointer transition-all duration-200 p-4 ${isSelected ? 'border-indigo-500 scale-105' : 'border-gray-700 hover:border-gray-600'}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-white">{strategy.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{strategy.description}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${riskColor}`}>{strategy.riskLevel} Risk</span>
            </div>
        </Card>
    );
}

export default AssignStrategyModal;