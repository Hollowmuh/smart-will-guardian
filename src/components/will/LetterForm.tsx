
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Heart, FileText } from 'lucide-react';

interface LetterFormProps {
  letter: string;
  onChange: (letter: string) => void;
}

const LetterForm: React.FC<LetterFormProps> = ({ letter, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Letter to Your Beneficiaries
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Write a personal message that will be shared with your beneficiaries
        </p>
      </div>

      <Card className="border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-950">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-pink-800 dark:text-pink-200">
            <Heart className="h-5 w-5" />
            <span>Your Final Words</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-pink-700 dark:text-pink-300">
          <p className="text-sm">
            This letter will be permanently stored on the blockchain and shared with your 
            beneficiaries when your will is executed. Take this opportunity to share your 
            thoughts, memories, and final wishes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Your Letter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="letter">Letter Content</Label>
            <Textarea
              id="letter"
              value={letter}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Dear family and friends,

I want you to know how much you have meant to me throughout my life...

With love and gratitude,
[Your name]"
              className="mt-1 min-h-[300px] resize-none"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {letter.length} characters
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Tips for writing your letter:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Share your love and appreciation</li>
              <li>• Include important memories or stories</li>
              <li>• Provide guidance or wisdom for the future</li>
              <li>• Express any final wishes or requests</li>
              <li>• Keep it heartfelt and personal</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LetterForm;
