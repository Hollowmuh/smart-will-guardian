
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../stores/walletStore';
import { Card, CardContent } from '../ui/card';
import { Shield, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, isConnected } = useWalletStore();

  useEffect(() => {
    if (!isConnected || !user?.isAuthenticated) {
      navigate('/login');
    }
  }, [isConnected, user, navigate]);

  if (!isConnected || !user?.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking authentication...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
