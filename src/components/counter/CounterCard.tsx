import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CounterData {
  prefix: string;
  nowServing: number;
  lastIssued: number;
}

interface CounterCardProps {
  counterId: string;
  counterData: CounterData;
  onCallNext: (counterId: string) => boolean;
  onRecall: (counterId: string) => boolean;
  onSkip: (counterId: string) => boolean;
  onReset: (counterId: string) => void;
  onStatusMessage: (message: string, type: 'success' | 'warning' | 'error') => void;
}

export const CounterCard = ({
  counterId,
  counterData,
  onCallNext,
  onRecall,
  onSkip,
  onReset,
  onStatusMessage
}: CounterCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const counterNum = counterId.replace('counter', '');
  const waitingCount = Math.max(0, counterData.lastIssued - counterData.nowServing);

  const handleCallNext = () => {
    const success = onCallNext(counterId);
    if (success) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
      onStatusMessage(`✅ Called ${counterData.prefix}${String(counterData.nowServing + 1).padStart(3, '0')}`, 'success');
    } else {
      onStatusMessage('⚠️ No customers waiting', 'warning');
    }
  };

  const handleRecall = () => {
    onRecall(counterId);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    onStatusMessage(`🔁 Recalled ${counterData.prefix}${String(counterData.nowServing).padStart(3, '0')}`, 'success');
  };

  const handleSkip = () => {
    const success = onSkip(counterId);
    if (success) {
      onStatusMessage(`⏭️ Skipped to ${counterData.prefix}${String(counterData.nowServing + 1).padStart(3, '0')}`, 'success');
    } else {
      onStatusMessage('⚠️ No customers to skip', 'warning');
    }
  };

  const handleReset = () => {
    if (window.confirm(`Are you sure you want to reset the queue for Counter ${counterNum}? This will set both serving and issued numbers back to 1.`)) {
      onReset(counterId);
      onStatusMessage(`✅ Queue reset for Counter ${counterNum}`, 'success');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-in fade-in duration-800">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full mx-auto mb-3 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{counterNum}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Counter {counterNum}</h3>
        <span className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-bold border border-indigo-200">
          {counterData.prefix}
        </span>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 text-center border border-indigo-200">
          <p className="text-sm text-gray-600 mb-2 font-medium">Now Serving</p>
          <p className={`text-3xl font-bold text-indigo-600 transition-all duration-500 ${isAnimating ? 'scale-110 text-green-600' : ''}`}>
            {counterData.prefix}{String(counterData.nowServing).padStart(3, '0')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 font-medium">Last Issued</p>
            <p className="text-lg font-bold text-gray-800">
              {counterData.prefix}{String(counterData.lastIssued).padStart(3, '0')}
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-200">
            <p className="text-xs text-orange-600 mb-1 font-medium">Waiting</p>
            <p className="text-lg font-bold text-orange-700">{waitingCount}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button
          onClick={handleCallNext}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
        >
          🔔 Call Next Customer
        </Button>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handleRecall}
            variant="outline"
            className="py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors text-xs border-0"
          >
            🔁 Recall
          </Button>
          <Button
            onClick={handleSkip}
            variant="outline"
            className="py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors text-xs border-0"
          >
            ⏭️ Skip
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors text-xs border-0"
          >
            🔄 Reset
          </Button>
        </div>
      </div>
    </div>
  );
};