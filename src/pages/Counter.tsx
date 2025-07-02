import { useState } from 'react';
import { useCounter } from '@/hooks/useCounter';
import { PinModal } from '@/components/counter/PinModal';
import { SetupPanel } from '@/components/counter/SetupPanel';
import { Dashboard } from '@/components/counter/Dashboard';
import { StatusToast } from '@/components/ui/status-toast';

const Counter = () => {
  const {
    hasAccess,
    selectedCounters,
    counterPrefixes,
    currentCounters,
    showSetup,
    grantAccess,
    handleCounterSelection,
    updatePrefix,
    validatePrefixes,
    saveSetup,
    callNext,
    recallCurrent,
    skipCurrent,
    resetQueue,
    backToSetup
  } = useCounter();

  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'warning' | 'error' | 'info'>('info');
  const [showStatus, setShowStatus] = useState(false);

  const handleStatusMessage = (message: string, type: 'success' | 'warning' | 'error' | 'info') => {
    setStatusMessage(message);
    setStatusType(type);
    setShowStatus(true);
  };

  const handleSaveSetup = () => {
    saveSetup();
    handleStatusMessage('✅ Counter setup saved successfully', 'success');
  };

  // Show PIN modal if no access
  if (!hasAccess) {
    return <PinModal isOpen={true} onSuccess={grantAccess} />;
  }

  // Show setup panel if no counters configured or user wants to edit
  if (showSetup || Object.keys(currentCounters).length === 0) {
    return (
      <>
        <SetupPanel
          selectedCounters={selectedCounters}
          counterPrefixes={counterPrefixes}
          onCounterSelection={handleCounterSelection}
          onPrefixUpdate={updatePrefix}
          onSave={handleSaveSetup}
          isValid={validatePrefixes()}
        />
        <StatusToast
          message={statusMessage}
          type={statusType}
          isVisible={showStatus}
          onHide={() => setShowStatus(false)}
        />
      </>
    );
  }

  // Show dashboard with configured counters
  return (
    <>
      <Dashboard
        counters={currentCounters}
        onCallNext={callNext}
        onRecall={recallCurrent}
        onSkip={skipCurrent}
        onReset={resetQueue}
        onBackToSetup={backToSetup}
        onStatusMessage={handleStatusMessage}
      />
      <StatusToast
        message={statusMessage}
        type={statusType}
        isVisible={showStatus}
        onHide={() => setShowStatus(false)}
      />
    </>
  );
};

export default Counter;