
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Shield, Clock, AlertTriangle } from 'lucide-react';

interface ProofOfLifeFormProps {
  overridePassword: string;
  confirmPassword: string;
  acknowledgeRisks: boolean;
  onChange: (data: {
    overridePassword?: string;
    confirmPassword?: string;
    acknowledgeRisks?: boolean;
  }) => void;
}

const ProofOfLifeForm: React.FC<ProofOfLifeFormProps> = ({
  overridePassword,
  confirmPassword,
  acknowledgeRisks,
  onChange
}) => {
  const passwordsMatch = overridePassword && confirmPassword && overridePassword === confirmPassword;
  const hasPasswordError = confirmPassword && !passwordsMatch;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Security & Proof of Life
        </h2>
        <p className="text-gray-600">
          Set up your proof-of-life system and emergency override
        </p>
      </div>

      {/* Proof of Life Explanation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Clock className="h-5 w-5" />
            <span>How Proof of Life Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p className="text-sm">
            You'll need to check in every 6 months to prove you're alive. 
            If you miss a check-in, your beneficiaries will be notified and given 
            30 days to claim their inheritance. This ensures your assets are 
            transferred according to your wishes.
          </p>
        </CardContent>
      </Card>

      {/* Override Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Emergency Override Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            This password allows you to immediately transfer assets to beneficiaries 
            in case of emergency, bypassing the normal proof-of-life period.
          </p>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="override-password">Override Password</Label>
              <Input
                id="override-password"
                type="password"
                value={overridePassword}
                onChange={(e) => onChange({ overridePassword: e.target.value })}
                placeholder="Enter a strong password"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => onChange({ confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className={`mt-1 ${hasPasswordError ? 'border-red-500' : ''}`}
              />
              {hasPasswordError && (
                <p className="text-sm text-red-600 mt-1">
                  Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Passwords match
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Acknowledgment */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <Alert className="border-yellow-300 bg-yellow-100">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Important:</strong> Smart contracts are immutable once deployed. 
              Make sure all information is correct before proceeding.
            </AlertDescription>
          </Alert>
          
          <div className="flex items-start space-x-3 mt-4">
            <Checkbox
              id="acknowledge-risks"
              checked={acknowledgeRisks}
              onCheckedChange={(checked) => 
                onChange({ acknowledgeRisks: checked as boolean })
              }
            />
            <div className="space-y-1 leading-none">
              <Label 
                htmlFor="acknowledge-risks"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I understand the risks
              </Label>
              <p className="text-xs text-gray-600">
                I understand that smart contracts are immutable and that I need to 
                keep my override password secure. I acknowledge that losing access 
                to my wallet or forgetting my password could result in permanent 
                loss of access to my will.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProofOfLifeForm;
