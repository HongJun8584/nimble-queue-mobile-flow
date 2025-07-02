import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PinModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export const PinModal = ({ isOpen, onSuccess }: PinModalProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    console.log('🔐 [PIN] Entered:', pin);
    
    if (pin === '0108') {
      onSuccess();
      setPin('');
      setError(false);
    } else {
      console.log('🔐 [PIN] Access denied');
      setError(true);
      setPin('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else {
      setError(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 animate-in slide-in-from-bottom-4 duration-600">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">🔐 Staff Access</h2>
        <p className="text-gray-600 text-center mb-6">Enter PIN to access counter system</p>
        
        <Input
          type="password"
          maxLength={4}
          placeholder="0000"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-4 text-center text-2xl border-2 border-gray-300 rounded-xl mb-4 focus:border-indigo-500"
          autoFocus
        />
        
        {error && (
          <div className="text-red-500 text-center mb-4">
            ❌ Incorrect PIN. Try again.
          </div>
        )}
        
        <Button 
          onClick={handleSubmit}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
        >
          Enter
        </Button>
      </div>
    </div>
  );
};