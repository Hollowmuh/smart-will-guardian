
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BeneficiariesForm from './BeneficiariesForm';
import LetterForm from './LetterForm';
import ProofOfLifeForm from './ProofOfLifeForm';
import ReviewForm from './ReviewForm';
import { FormData, Beneficiary } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '../layout/Header';

const steps = [
  { id: 1, title: 'Beneficiaries', description: 'Add people who will inherit your assets' },
  { id: 2, title: 'Letter', description: 'Write a personal message to your beneficiaries' },
  { id: 3, title: 'Security', description: 'Set up proof-of-life and override password' },
  { id: 4, title: 'Review', description: 'Review and deploy your will' }
];

const CreateWillWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    beneficiaries: [],
    letter: '',
    overridePassword: '',
    confirmPassword: '',
    acknowledgeRisks: false
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        const totalPercentage = formData.beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
        return formData.beneficiaries.length > 0 && totalPercentage === 100;
      case 2:
        return true; // Letter is optional
      case 3:
        return formData.overridePassword && 
               formData.confirmPassword && 
               formData.overridePassword === formData.confirmPassword &&
               formData.acknowledgeRisks;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BeneficiariesForm
            beneficiaries={formData.beneficiaries}
            onChange={(beneficiaries) => updateFormData({ beneficiaries })}
          />
        );
      case 2:
        return (
          <LetterForm
            letter={formData.letter}
            onChange={(letter) => updateFormData({ letter })}
          />
        );
      case 3:
        return (
          <ProofOfLifeForm
            overridePassword={formData.overridePassword}
            confirmPassword={formData.confirmPassword}
            acknowledgeRisks={formData.acknowledgeRisks}
            onChange={(data) => updateFormData(data)}
          />
        );
      case 4:
        return (
          <ReviewForm
            formData={formData}
            onDeploy={() => navigate('/deployment')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }
                  `}>
                    {step.id}
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{step.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-1 mx-8
                    ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={currentStep === 1 ? () => navigate('/dashboard') : prevStep}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{currentStep === 1 ? 'Back to Dashboard' : 'Previous'}</span>
          </Button>

          {currentStep < steps.length && (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateWillWizard;
