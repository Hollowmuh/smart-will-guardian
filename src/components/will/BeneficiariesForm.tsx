
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Plus, Trash2, Users } from 'lucide-react';
import { Beneficiary } from '../../types';

interface BeneficiariesFormProps {
  beneficiaries: Beneficiary[];
  onChange: (beneficiaries: Beneficiary[]) => void;
}

const BeneficiariesForm: React.FC<BeneficiariesFormProps> = ({ beneficiaries, onChange }) => {
  const { control, register, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      beneficiaries: beneficiaries.length > 0 ? beneficiaries : [{
        id: crypto.randomUUID(),
        name: '',
        walletAddress: '',
        email: '',
        percentage: 100
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'beneficiaries'
  });

  const watchedBeneficiaries = watch('beneficiaries');
  const totalPercentage = watchedBeneficiaries.reduce((sum, b) => sum + (Number(b.percentage) || 0), 0);

  React.useEffect(() => {
    onChange(watchedBeneficiaries);
  }, [watchedBeneficiaries, onChange]);

  const addBeneficiary = () => {
    append({
      id: crypto.randomUUID(),
      name: '',
      walletAddress: '',
      email: '',
      percentage: 0
    });
  };

  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Beneficiaries</h2>
        <p className="text-gray-600">
          Specify who will receive your assets and what percentage each person gets.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="border-2 border-gray-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Beneficiary {index + 1}
                </h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`beneficiaries.${index}.name`}>
                    Display Name (Optional)
                  </Label>
                  <Input
                    {...register(`beneficiaries.${index}.name`)}
                    placeholder="e.g., John Doe"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`beneficiaries.${index}.email`}>
                    Email (Optional)
                  </Label>
                  <Input
                    {...register(`beneficiaries.${index}.email`)}
                    type="email"
                    placeholder="e.g., john@example.com"
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor={`beneficiaries.${index}.walletAddress`}>
                    Wallet Address *
                  </Label>
                  <Input
                    {...register(`beneficiaries.${index}.walletAddress`, {
                      required: 'Wallet address is required',
                      validate: (value) => 
                        isValidEthereumAddress(value) || 'Please enter a valid Ethereum address'
                    })}
                    placeholder="0x..."
                    className={`mt-1 ${
                      errors.beneficiaries?.[index]?.walletAddress 
                        ? 'border-red-500' 
                        : watchedBeneficiaries[index]?.walletAddress && isValidEthereumAddress(watchedBeneficiaries[index].walletAddress)
                        ? 'border-green-500'
                        : ''
                    }`}
                  />
                  {errors.beneficiaries?.[index]?.walletAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.beneficiaries[index]?.walletAddress?.message}
                    </p>
                  )}
                  {watchedBeneficiaries[index]?.walletAddress && 
                   isValidEthereumAddress(watchedBeneficiaries[index].walletAddress) && (
                    <p className="text-green-600 text-sm mt-1">
                      ✓ Valid Ethereum address
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`beneficiaries.${index}.percentage`}>
                    Percentage *
                  </Label>
                  <Input
                    {...register(`beneficiaries.${index}.percentage`, {
                      required: 'Percentage is required',
                      min: { value: 1, message: 'Minimum 1%' },
                      max: { value: 100, message: 'Maximum 100%' }
                    })}
                    type="number"
                    min="1"
                    max="100"
                    className="mt-1"
                  />
                  {errors.beneficiaries?.[index]?.percentage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.beneficiaries[index]?.percentage?.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Button
          type="button"
          onClick={addBeneficiary}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Another Beneficiary</span>
        </Button>

        <div className={`text-right ${
          totalPercentage === 100 ? 'text-green-600' : 'text-red-600'
        }`}>
          <p className="text-lg font-medium">
            Total: {totalPercentage}%
          </p>
          {totalPercentage !== 100 && (
            <p className="text-sm">
              Must equal 100%
            </p>
          )}
        </div>
      </div>

      {totalPercentage !== 100 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-yellow-700">
            The total percentage must equal 100% to continue. 
            Current total: {totalPercentage}%
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BeneficiariesForm;
