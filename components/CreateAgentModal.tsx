
import React, { useState } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

interface CreateAgentModalProps {
  onClose: () => void;
  onCreate: (name: string, balance: number) => void;
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('10');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balanceNum = parseFloat(balance);
    if (!name.trim()) {
      setError('Agent name is required.');
      return;
    }
    if (isNaN(balanceNum) || balanceNum <= 0) {
      setError('Initial balance must be a positive number.');
      return;
    }
    setError('');
    onCreate(name, balanceNum);
  };

  return (
    <Modal title="Create New Agent" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="agent-name" className="block text-sm font-medium text-gray-300 mb-1">
            Agent Name
          </label>
          <Input
            id="agent-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., 'My First Bot'"
          />
        </div>
        <div>
          <label htmlFor="initial-balance" className="block text-sm font-medium text-gray-300 mb-1">
            Initial Balance (USD)
          </label>
          <Input
            id="initial-balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="mt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Agent</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAgentModal;
