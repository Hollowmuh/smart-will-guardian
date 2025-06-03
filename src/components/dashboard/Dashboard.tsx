
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../stores/walletStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, FileText, Clock, AlertCircle } from 'lucide-react';
import Header from '../layout/Header';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { address } = useWalletStore();

  const mockWills = [
    {
      id: '1',
      status: 'active' as const,
      createdAt: new Date('2024-01-15'),
      beneficiaries: 3,
      nextCheckIn: new Date('2024-07-15')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'executed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
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
                <h3 className="font-semibold text-gray-900">Create New Will</h3>
                <p className="text-sm text-gray-600">Set up a new Smart Will</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-green-600 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Active Wills</h3>
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
                <h3 className="font-semibold text-gray-900">Next Check-in</h3>
                <p className="text-sm text-gray-600">
                  {mockWills[0]?.nextCheckIn.toLocaleDateString()}
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
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Smart Wills yet
                </h3>
                <p className="text-gray-600 mb-6">
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
                  <div key={will.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">
                              Smart Will #{will.id}
                            </h3>
                            <Badge className={getStatusColor(will.status)}>
                              {will.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Created on {will.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {will.beneficiaries} beneficiaries
                        </p>
                        <p className="text-sm text-gray-600">
                          Next check-in: {will.nextCheckIn.toLocaleDateString()}
                        </p>
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
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardContent className="flex items-center p-6">
              <AlertCircle className="h-6 w-6 text-orange-600 mr-4" />
              <div>
                <h3 className="font-semibold text-orange-800">
                  Proof of Life Reminder
                </h3>
                <p className="text-sm text-orange-700">
                  Your next check-in is due on {mockWills[0].nextCheckIn.toLocaleDateString()}.
                  Don't forget to confirm you're alive to prevent your will from executing.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
