
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../stores/walletStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Wallet, ArrowLeft, Shield } from 'lucide-react';
import Header from '../layout/Header';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isConnected, 
    isConnecting, 
    user, 
    error, 
    connectWallet, 
    authenticate, 
    clearError 
  } = useWalletStore();

  useEffect(() => {
    if (user?.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleRegister = async () => {
    if (!isConnected) {
      await connectWallet();
    } else {
      await authenticate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header showWalletInfo={false} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-md">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create Your Smart Will
              </CardTitle>
              <p className="text-gray-600">
                Connect your wallet to get started with Smart Will
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {!isConnected ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Connect your wallet to create your Smart Will
                    </p>
                    <Button
                      onClick={handleRegister}
                      disabled={isConnecting}
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2 py-3"
                    >
                      <Wallet className="h-5 w-5" />
                      <span>
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                      </span>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-green-700">
                        ✓ Wallet connected successfully
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Sign a message to authenticate and create your account
                    </p>
                    <Button
                      onClick={authenticate}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                    >
                      Sign to Create Account
                    </Button>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Already have a Smart Will?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By connecting your wallet, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
