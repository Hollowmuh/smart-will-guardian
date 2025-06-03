
import React from 'react';
import { useWalletStore } from '../../stores/walletStore';
import { Button } from '../ui/button';
import { Wallet, LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  showWalletInfo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showWalletInfo = true }) => {
  const { address, isConnected, user, connectWallet, logout, disconnectWallet } = useWalletStore();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Smart Will</h1>
          </div>

          {/* Wallet Connection */}
          {showWalletInfo && (
            <div className="flex items-center space-x-4">
              {isConnected && address ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{formatAddress(address)}</span>
                  </div>
                  {user?.isAuthenticated ? (
                    <Button
                      onClick={logout}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={disconnectWallet}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Wallet className="h-4 w-4" />
                      <span>Disconnect</span>
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
