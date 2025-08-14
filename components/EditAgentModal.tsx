
import React, { useState } from 'react';
import { Agent } from '../types';
import { generateUniqueId } from '../constants';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

interface EditAgentModalProps {
  agent: Agent;
  onClose: () => void;
  onSave: (agentId: string, name: string, balance: number, avatarUrl: string) => void;
}

const EditAgentModal: React.FC<EditAgentModalProps> = ({ agent, onClose, onSave }) => {
  const [name, setName] = useState(agent.name);
  const [balance, setBalance] = useState(agent.balance.toString());
  const [avatarUrl, setAvatarUrl] = useState(agent.avatarUrl);
  const [error, setError] = useState('');

  const handleRandomizeAvatar = () => {
    setAvatarUrl(`https://api.dicebear.com/8.x/adventurer/svg?seed=${generateUniqueId()}`);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balanceNum = parseFloat(balance);
    if (!name.trim()) {
      setError('Agent name is required.');
      return;
    }
    if (isNaN(balanceNum) || balanceNum <= 0) {
      setError('Balance must be a positive number.');
      return;
    }
    if (!avatarUrl.trim()) {
      setError('Avatar URL is required.');
      return;
    }
    setError('');
    onSave(agent.id, name, balanceNum, avatarUrl);
  };

  return (
    <Modal title={`Edit ${agent.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="edit-agent-name" className="block text-sm font-medium text-gray-300 mb-1">
            Agent Name
          </label>
          <Input
            id="edit-agent-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., 'My First Bot'"
          />
        </div>
        <div>
          <label htmlFor="edit-balance" className="block text-sm font-medium text-gray-300 mb-1">
            Balance (USD)
          </label>
          <Input
            id="edit-balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Agent Avatar
          </label>
          <div className="flex items-center gap-4">
            <img
              key={avatarUrl}
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-600 bg-gray-900"
              onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(agent.name)}`; }}
            />
            <div className="flex-grow">
              <label htmlFor="edit-avatar-url" className="block text-sm font-medium text-gray-300 mb-1">
                Image URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="edit-avatar-url"
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                />
                <Button type="button" variant="secondary" onClick={handleRandomizeAvatar}>
                  Random
                </Button>
              </div>
            </div>
          </div>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditAgentModal;