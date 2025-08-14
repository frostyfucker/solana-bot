
import React from 'react';
import { BotIcon, WalletIcon } from '../constants';
import Button from './ui/Button';

interface HeaderProps {
  walletAddress: string | null;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ walletAddress, onDisconnect }) => {
  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <header className="py-4 px-4 md:px-8 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BotIcon />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Aura<span className="text-indigo-400">Bot</span>
          </h1>
        </div>
        {walletAddress && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800/70 border border-gray-700 rounded-full px-4 py-2 text-sm">
              <WalletIcon />
              <span className="font-mono">{truncatedAddress}</span>
            </div>
            <Button onClick={onDisconnect} variant="secondary">
              Disconnect
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;