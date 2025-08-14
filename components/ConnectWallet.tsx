
import React from 'react';
import Button from './ui/Button';
import { WalletIcon } from '../constants';
import Card from './ui/Card';

interface ConnectWalletProps {
  onConnect: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
  return (
    <div className="flex items-center justify-center pt-24">
      <Card className="max-w-md w-full text-center">
        <div className="p-8">
            <div className="flex justify-center mb-6">
                <div className="bg-indigo-500/10 p-4 rounded-full border-2 border-indigo-500/30">
                    <WalletIcon />
                </div>
            </div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-8">
            To start creating and managing your trading agents, please connect your wallet.
          </p>
          <Button onClick={onConnect} size="lg" className="w-full">
            Connect Wallet
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConnectWallet;