
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { FormData } from '../../types';
import { 
  Users, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  ExternalLink 
} from 'lucide-react';

interface ReviewFormProps {
  formData: FormData;
  onDeploy: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ formData, onDeploy }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentTx, setDeploymentTx] = useState<string | null>(null);

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      // Simulate contract deployment
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
      setDeploymentTx(mockTxHash);
      setTimeout(() => {
        onDeploy();
      }, 2000);
    } catch (error) {
      console.error('Deployment failed:', error);
      setIsDeploying(false);
    }
  };

  if (deploymentTx) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Smart Will Deployed Successfully!
          </h2>
          <p className="text-gray-600">
            Your Smart Will has been deployed to the blockchain
          </p>
        </div>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">
                Transaction Hash:
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-green-700">
                  {deploymentTx.substring(0, 10)}...{deploymentTx.substring(-8)}
                </span>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-sm text-gray-600">
          Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Smart Will
        </h2>
        <p className="text-gray-600">
          Please review all details before deploying to the blockchain
        </p>
      </div>

      {/* Beneficiaries Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Beneficiaries ({formData.beneficiaries.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {formData.beneficiaries.map((beneficiary, index) => (
              <div key={beneficiary.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {beneficiary.name || `Beneficiary ${index + 1}`}
                  </p>
                  <p className="text-sm text-gray-600 font-mono">
                    {beneficiary.walletAddress.substring(0, 10)}...{beneficiary.walletAddress.substring(-8)}
                  </p>
                  {beneficiary.email && (
                    <p className="text-sm text-gray-600">{beneficiary.email}</p>
                  )}
                </div>
                <Badge variant="outline" className="text-sm">
                  {beneficiary.percentage}%
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-800">Total Allocation:</span>
              <span className="font-bold text-blue-800">
                {formData.beneficiaries.reduce((sum, b) => sum + b.percentage, 0)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Proof of Life Interval</p>
                <p className="text-sm text-gray-600">How often you need to check in</p>
              </div>
            </div>
            <Badge variant="outline">6 months</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Override Password</p>
                <p className="text-sm text-gray-600">Emergency access configured</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Set
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Warning */}
      <Alert className="border-yellow-300 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Final Warning:</strong> Once deployed, your Smart Will cannot be modified. 
          Make sure all information is correct. Deployment will cost gas fees.
        </AlertDescription>
      </Alert>

      {/* Deploy Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
        >
          {isDeploying ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Deploying to Blockchain...
            </>
          ) : (
            <>
              <Shield className="h-5 w-5 mr-2" />
              Deploy Smart Will
            </>
          )}
        </Button>
      </div>

      {isDeploying && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            This may take a few minutes. Please don't close this window.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
