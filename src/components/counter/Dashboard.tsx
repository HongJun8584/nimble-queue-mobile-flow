import { Button } from '@/components/ui/button';
import { CounterCard } from './CounterCard';

interface CounterData {
  prefix: string;
  nowServing: number;
  lastIssued: number;
}

interface Counters {
  [key: string]: CounterData;
}

interface DashboardProps {
  counters: Counters;
  onCallNext: (counterId: string) => boolean;
  onRecall: (counterId: string) => boolean;
  onSkip: (counterId: string) => boolean;
  onReset: (counterId: string) => void;
  onBackToSetup: () => void;
  onStatusMessage: (message: string, type: 'success' | 'warning' | 'error') => void;
}

export const Dashboard = ({
  counters,
  onCallNext,
  onRecall,
  onSkip,
  onReset,
  onBackToSetup,
  onStatusMessage
}: DashboardProps) => {
  return (
    <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-3xl text-white">🎯</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Counter Dashboard</h1>
          <p className="text-gray-600">Real-time queue management system</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Active
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(counters).map(([counterId, counterData]) => (
            <CounterCard
              key={counterId}
              counterId={counterId}
              counterData={counterData}
              onCallNext={onCallNext}
              onRecall={onRecall}
              onSkip={onSkip}
              onReset={onReset}
              onStatusMessage={onStatusMessage}
            />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button
            onClick={onBackToSetup}
            variant="outline"
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors border-0"
          >
            🔧 Edit Setup
          </Button>
        </div>
      </div>
    </div>
  );
};