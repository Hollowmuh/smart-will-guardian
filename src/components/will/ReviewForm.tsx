
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
  ExternalLink,
  FileText
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
        <div className="bg-green-100 dark:bg-green-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Smart Will Deployed Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your Smart Will has been deployed to the blockchain
          </p>
        </div>
        
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Transaction Hash:
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-green-700 dark:text-green-300">
                  {deploymentTx.substring(0, 10)}...{deploymentTx.substring(-8)}
                </span>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Review Your Smart Will
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
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
              <div key={beneficiary.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {beneficiary.name || `Beneficiary ${index + 1}`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {beneficiary.walletAddress.substring(0, 10)}...{beneficiary.walletAddress.substring(-8)}
                  </p>
                  {beneficiary.email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{beneficiary.email}</p>
                  )}
                </div>
                <Badge variant="outline" className="text-sm">
                  {beneficiary.percentage}%
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-800 dark:text-blue-200">Total Allocation:</span>
              <span className="font-bold text-blue-800 dark:text-blue-200">
                {formData.beneficiaries.reduce((sum, b) => sum + b.percentage, 0)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Letter Summary */}
      {formData.letter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Letter to Beneficiaries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-6">
                {formData.letter}
              </p>
              {formData.letter.length > 200 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Letter preview - {formData.letter.length} characters total
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Proof of Life Interval</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">How often you need to check in</p>
              </div>
            </div>
            <Badge variant="outline">{formData.proofOfLifeInterval} months</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Override Password</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Emergency access configured</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 dark:text-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              Set
            </Badge>
          </div>

          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Important:</strong> Will execution occurs after 12 months of no check-ins, 
              regardless of your selected interval.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Warning */}
      <Alert className="border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This may take a few minutes. Please don't close this window.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
