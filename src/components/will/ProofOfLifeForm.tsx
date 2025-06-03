
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Shield, Clock, AlertTriangle, Skull } from 'lucide-react';

interface ProofOfLifeFormProps {
  overridePassword: string;
  confirmPassword: string;
  acknowledgeRisks: boolean;
  proofOfLifeInterval: number;
  onChange: (data: {
    overridePassword?: string;
    confirmPassword?: string;
    acknowledgeRisks?: boolean;
    proofOfLifeInterval?: number;
  }) => void;
}

const ProofOfLifeForm: React.FC<ProofOfLifeFormProps> = ({
  overridePassword,
  confirmPassword,
  acknowledgeRisks,
  proofOfLifeInterval,
  onChange
}) => {
  const passwordsMatch = overridePassword && confirmPassword && overridePassword === confirmPassword;
  const hasPasswordError = confirmPassword && !passwordsMatch;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Security & Proof of Life
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set up your proof-of-life system and emergency override
        </p>
      </div>

      {/* Proof of Life Interval Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Proof of Life Interval</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose how often you need to check in to prove you're alive.
          </p>
          
          <RadioGroup
            value={proofOfLifeInterval.toString()}
            onValueChange={(value) => onChange({ proofOfLifeInterval: parseInt(value) })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="3months" />
              <Label htmlFor="3months" className="text-sm font-medium">
                Every 3 months (Recommended for high security)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="12" id="12months" />
              <Label htmlFor="12months" className="text-sm font-medium">
                Every 12 months (Standard)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24" id="24months" />
              <Label htmlFor="24months" className="text-sm font-medium">
                Every 24 months (Extended)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Will Execution Explanation */}
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-200">
            <Skull className="h-5 w-5" />
            <span>Will Execution</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-red-700 dark:text-red-300">
          <p className="text-sm">
            <strong>Important:</strong> If you fail to check in for 12 consecutive months, 
            regardless of your selected interval, your will will be automatically executed 
            and your assets will be distributed to your beneficiaries. This safety mechanism 
            ensures your will is executed even if you selected a longer interval.
          </p>
        </CardContent>
      </Card>

      {/* Proof of Life Explanation */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
            <Clock className="h-5 w-5" />
            <span>How Proof of Life Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 dark:text-blue-300">
          <p className="text-sm">
            You'll need to check in every {proofOfLifeInterval} months to prove you're alive. 
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
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
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardContent className="pt-6">
          <Alert className="border-yellow-300 bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
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
              <p className="text-xs text-gray-600 dark:text-gray-400">
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
