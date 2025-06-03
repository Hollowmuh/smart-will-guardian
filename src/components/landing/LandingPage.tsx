
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Shield, Clock, Users, ArrowRight, Check } from 'lucide-react';
import Header from '../layout/Header';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Your will is secured by immutable smart contracts on the blockchain'
    },
    {
      icon: Clock,
      title: 'Proof of Life',
      description: 'Automated check-ins ensure your will executes only when intended'
    },
    {
      icon: Users,
      title: 'Direct Distribution',
      description: 'Assets transfer directly to beneficiaries without intermediaries'
    }
  ];

  const benefits = [
    'No legal fees or lengthy probate processes',
    'Complete privacy and security through blockchain',
    'Automated execution with proof-of-life verification',
    'Direct wallet-to-wallet asset transfer',
    'Immutable and tamper-proof documentation'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header showWalletInfo={false} />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure Your Legacy on the
              <span className="text-blue-600 block">Blockchain</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create a tamper-proof digital will that automatically executes when you're no longer able to check in. 
              No lawyers, no probate, no delays.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg flex items-center space-x-2 shadow-lg transform transition hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-600 transition"
              >
                Already Have an Account?
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Smart Will Works
            </h2>
            <p className="text-xl text-gray-600">
              Revolutionary estate planning powered by blockchain technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Smart Will?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Traditional estate planning is expensive, slow, and prone to disputes. 
                Smart Will eliminates these problems with blockchain technology.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-1 mt-1">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-8">
                Create your blockchain will in minutes. Connect your wallet and follow our 
                secure step-by-step process.
              </p>
              <Button
                onClick={() => navigate('/register')}
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg w-full flex items-center justify-center space-x-2"
              >
                <span>Start Creating Your Will</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">Smart Will</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Secure, automated, and transparent estate planning for the digital age.
          </p>
          <p className="text-sm text-gray-500">
            © 2024 Smart Will. Built on blockchain for ultimate security and transparency.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
