import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../stores/walletStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, FileText, Clock, AlertCircle, Edit, DollarSign } from 'lucide-react';
import Header from '../layout/Header';
import EditWillForm from '../will/EditWillForm';
import { Will } from '../../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { address } = useWalletStore();
  const [editingWill, setEditingWill] = useState<Will | null>(null);

  const [mockWills, setMockWills] = useState<Will[]>([
    {
      id: '1',
      creatorAddress: address || '',
      status: 'active' as const,
      createdAt: new Date('2024-01-15'),
      beneficiaries: [
        { id: '1', name: 'Alice', walletAddress: '0x123...abc', percentage: 60 },
        { id: '2', name: 'Bob', walletAddress: '0x456...def', percentage: 40 }
      ],
      overridePasswordHash: 'hashedpassword',
      proofOfLifeInterval: 12,
      nextCheckInDue: new Date('2024-07-15'),
      totalFunds: 5.5,
      letter: 'My dear family...'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'executed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleEditWill = (will: Will) => {
    setEditingWill(will);
  };

  const handleSaveWill = (updatedWill: Will) => {
    setMockWills(prev => prev.map(w => w.id === updatedWill.id ? updatedWill : w));
    setEditingWill(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your Smart Will and beneficiaries
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/create-will')}>
            <CardContent className="flex items-center p-6">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Create New Will</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Set up a new Smart Will</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-green-600 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Active Wills</h3>
                <p className="text-2xl font-bold text-green-600">{mockWills.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-orange-600 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Next Check-in</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mockWills[0]?.nextCheckInDue?.toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Wills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Your Smart Wills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockWills.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Smart Wills yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first Smart Will to get started
                </p>
                <Button
                  onClick={() => navigate('/create-will')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Smart Will
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {mockWills.map((will) => (
                  <div key={will.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              Smart Will #{will.id}
                            </h3>
                            <Badge className={getStatusColor(will.status)}>
                              {will.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Created on {will.createdAt.toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {will.totalFunds || 0} ETH
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {will.beneficiaries.length} beneficiaries
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right mr-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Check-in every {will.proofOfLifeInterval} months
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Next: {will.nextCheckInDue?.toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditWill(will)}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proof of Life Reminder */}
        {mockWills.length > 0 && (
          <Card className="mt-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardContent className="flex items-center p-6">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-4" />
              <div>
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                  Proof of Life Reminder
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Your next check-in is due on {mockWills[0].nextCheckInDue?.toLocaleDateString()}.
                  Don't forget to confirm you're alive to prevent your will from executing.
                  Remember: If you don't check in for 12 consecutive months, your will will be executed automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Will Modal */}
      {editingWill && (
        <EditWillForm
          will={editingWill}
          isOpen={!!editingWill}
          onClose={() => setEditingWill(null)}
          onSave={handleSaveWill}
        />
      )}
    </div>
  );
};

export default Dashboard;
