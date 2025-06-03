import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Will, Beneficiary } from '../../types';
import { Plus, Trash2, DollarSign, Users, Edit } from 'lucide-react';

interface EditWillFormProps {
  will: Will;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedWill: Will) => void;
}

// Simple ID generator as alternative to uuid
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const EditWillForm: React.FC<EditWillFormProps> = ({
  will,
  isOpen,
  onClose,
  onSave
}) => {
  const [editedWill, setEditedWill] = useState<Will>(will);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    walletAddress: '',
    email: '',
    percentage: 0
  });
  const [fundsToAdd, setFundsToAdd] = useState<string>('');

  const handleAddBeneficiary = () => {
    if (!newBeneficiary.walletAddress || newBeneficiary.percentage <= 0) return;

    const beneficiary: Beneficiary = {
      id: generateId(),
      ...newBeneficiary
    };

    setEditedWill(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, beneficiary]
    }));

    setNewBeneficiary({
      name: '',
      walletAddress: '',
      email: '',
      percentage: 0
    });
  };

  const handleRemoveBeneficiary = (id: string) => {
    setEditedWill(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter(b => b.id !== id)
    }));
  };

  const handleUpdateBeneficiary = (id: string, field: keyof Beneficiary, value: string | number) => {
    setEditedWill(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.map(b =>
        b.id === id ? { ...b, [field]: value } : b
      )
    }));
  };

  const handleAddFunds = () => {
    const amount = parseFloat(fundsToAdd);
    if (amount > 0) {
      setEditedWill(prev => ({
        ...prev,
        totalFunds: (prev.totalFunds || 0) + amount
      }));
      setFundsToAdd('');
    }
  };

  const totalPercentage = editedWill.beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
  const canSave = totalPercentage === 100 && editedWill.beneficiaries.length > 0;

  const handleSave = () => {
    if (canSave) {
      onSave(editedWill);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Edit Smart Will #{will.id}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Funds Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Funds Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Current Balance</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total funds in the will</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{editedWill.totalFunds || 0} ETH</p>
                </div>
              </div>
              
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label htmlFor="add-funds">Add Funds (ETH)</Label>
                  <Input
                    id="add-funds"
                    type="number"
                    step="0.001"
                    value={fundsToAdd}
                    onChange={(e) => setFundsToAdd(e.target.value)}
                    placeholder="0.0"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleAddFunds} disabled={!fundsToAdd || parseFloat(fundsToAdd) <= 0}>
                  Add Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Beneficiaries Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Beneficiaries ({editedWill.beneficiaries.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Beneficiaries */}
              <div className="space-y-3">
                {editedWill.beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <Label htmlFor={`name-${beneficiary.id}`}>Name</Label>
                        <Input
                          id={`name-${beneficiary.id}`}
                          value={beneficiary.name || ''}
                          onChange={(e) => handleUpdateBeneficiary(beneficiary.id, 'name', e.target.value)}
                          placeholder="Beneficiary name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`wallet-${beneficiary.id}`}>Wallet Address</Label>
                        <Input
                          id={`wallet-${beneficiary.id}`}
                          value={beneficiary.walletAddress}
                          onChange={(e) => handleUpdateBeneficiary(beneficiary.id, 'walletAddress', e.target.value)}
                          placeholder="0x..."
                          className="font-mono text-sm"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`percentage-${beneficiary.id}`}>Percentage</Label>
                        <Input
                          id={`percentage-${beneficiary.id}`}
                          type="number"
                          min="1"
                          max="100"
                          value={beneficiary.percentage}
                          onChange={(e) => handleUpdateBeneficiary(beneficiary.id, 'percentage', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveBeneficiary(beneficiary.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Beneficiary */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Add New Beneficiary</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label htmlFor="new-name">Name</Label>
                    <Input
                      id="new-name"
                      value={newBeneficiary.name}
                      onChange={(e) => setNewBeneficiary(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Beneficiary name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-wallet">Wallet Address</Label>
                    <Input
                      id="new-wallet"
                      value={newBeneficiary.walletAddress}
                      onChange={(e) => setNewBeneficiary(prev => ({ ...prev, walletAddress: e.target.value }))}
                      placeholder="0x..."
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-percentage">Percentage</Label>
                    <Input
                      id="new-percentage"
                      type="number"
                      min="1"
                      max="100"
                      value={newBeneficiary.percentage || ''}
                      onChange={(e) => setNewBeneficiary(prev => ({ ...prev, percentage: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  
                  <Button
                    onClick={handleAddBeneficiary}
                    disabled={!newBeneficiary.walletAddress || newBeneficiary.percentage <= 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Total Allocation */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Total Allocation:</span>
                  <Badge variant={totalPercentage === 100 ? "default" : "destructive"} className="text-sm">
                    {totalPercentage}%
                  </Badge>
                </div>
                {totalPercentage !== 100 && (
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Total must equal 100% to save changes
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!canSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditWillForm;
