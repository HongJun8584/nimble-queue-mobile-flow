import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface SetupPanelProps {
  selectedCounters: Set<string>;
  counterPrefixes: Record<string, string>;
  onCounterSelection: (counterId: string, isChecked: boolean) => boolean;
  onPrefixUpdate: (counterId: string, prefix: string) => void;
  onSave: () => void;
  isValid: boolean;
}

export const SetupPanel = ({
  selectedCounters,
  counterPrefixes,
  onCounterSelection,
  onPrefixUpdate,
  onSave,
  isValid
}: SetupPanelProps) => {
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  const [prefixError, setPrefixError] = useState('');

  const handleCounterChange = (counterId: string, checked: boolean) => {
    const success = onCounterSelection(counterId, checked);
    if (!success && checked) {
      setShowMaxWarning(true);
      setTimeout(() => setShowMaxWarning(false), 4000);
    }
  };

  const validatePrefix = (prefix: string) => {
    if (prefix && !/^[A-Z0-9]+$/.test(prefix)) {
      setPrefixError('Prefix must contain only uppercase letters and numbers');
      return false;
    }

    // Check for duplicates
    const prefixes = Object.values(counterPrefixes);
    const duplicates = prefixes.filter(p => p === prefix && p !== '');
    if (duplicates.length > 1) {
      setPrefixError('Duplicate prefixes are not allowed');
      return false;
    }

    setPrefixError('');
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto text-center bg-white rounded-xl shadow-lg gap-6">
      <div className="w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl text-white">🎯</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Counter Setup</h1>
        <p className="text-gray-600">Configure up to 7 counters for your service</p>
      </div>

      {/* Counter Selection */}
      <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-bold">1</span>
          Select Counters
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
            const counterId = `counter${num}`;
            const isChecked = selectedCounters.has(counterId);
            
            return (
              <div key={counterId} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-100 cursor-pointer">
                <Checkbox
                  id={counterId}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleCounterChange(counterId, checked as boolean)}
                  className="w-4 h-4"
                />
                <label htmlFor={counterId} className="text-sm font-medium text-gray-700 cursor-pointer">
                  Counter {num}
                </label>
              </div>
            );
          })}
        </div>
        
        {showMaxWarning && (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 text-sm mt-3 p-3 rounded-lg">
            ⚠️ Maximum 7 counters allowed for optimal performance
          </div>
        )}
        
        {selectedCounters.size > 0 && (
          <div className="text-sm text-gray-500 mt-3 text-center">
            {selectedCounters.size} of 7 counters selected
          </div>
        )}
      </div>

      {/* Prefix Setup */}
      {selectedCounters.size > 0 && (
        <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">2</span>
            Set Prefixes
          </h3>
          <div className="space-y-4">
            {Array.from(selectedCounters).sort().map(counterId => {
              const counterNum = counterId.replace('counter', '');
              const prefix = counterPrefixes[counterId] || '';
              
              return (
                <div key={counterId} className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-indigo-600">{counterNum}</span>
                    </div>
                    <label className="text-sm font-semibold text-gray-700">Counter {counterNum}</label>
                  </div>
                  <Input
                    type="text"
                    placeholder="A"
                    maxLength={5}
                    value={prefix}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      onPrefixUpdate(counterId, value);
                    }}
                    onBlur={(e) => validatePrefix(e.target.value)}
                    className="w-16 h-10 text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase font-bold text-gray-800"
                  />
                </div>
              );
            })}
          </div>
          
          {prefixError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm mt-3 p-3 rounded-lg">
              {prefixError}
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-3 text-center">
            Use 1-5 uppercase letters/numbers (e.g. A, B1, MDZ)
          </div>
        </div>
      )}

      <Button
        onClick={onSave}
        disabled={!isValid}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
      >
        <span className="flex items-center justify-center gap-2">
          <span>🚀</span>
          <span>Launch Counter System</span>
        </span>
      </Button>
    </div>
  );
};