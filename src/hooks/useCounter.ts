import { useState, useEffect, useCallback } from 'react';

interface CounterData {
  prefix: string;
  nowServing: number;
  lastIssued: number;
}

interface Counters {
  [key: string]: CounterData;
}

export const useCounter = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedCounters, setSelectedCounters] = useState<Set<string>>(new Set());
  const [counterPrefixes, setCounterPrefixes] = useState<Record<string, string>>({});
  const [currentCounters, setCurrentCounters] = useState<Counters>({});
  const [showSetup, setShowSetup] = useState(false);

  // Check access on mount
  useEffect(() => {
    const accessGranted = sessionStorage.getItem('counterAccess') === 'granted';
    console.log('🔐 [SESSION] Access check:', accessGranted);
    setHasAccess(accessGranted);
    
    if (accessGranted) {
      loadExistingSetup();
    }
  }, []);

  const grantAccess = useCallback(() => {
    console.log('🔐 [PIN] Access granted');
    sessionStorage.setItem('counterAccess', 'granted');
    setHasAccess(true);
    loadExistingSetup();
  }, []);

  const loadExistingSetup = useCallback(() => {
    console.log('📊 [LOAD] Checking existing setup...');
    
    // Try localStorage first (fallback)
    const savedCounters = localStorage.getItem('counters');
    if (savedCounters) {
      try {
        const counters = JSON.parse(savedCounters);
        console.log('📊 [LOAD] localStorage counters:', counters);
        setCurrentCounters(counters);
        setShowSetup(Object.keys(counters).length === 0);
        return;
      } catch (error) {
        console.error('Failed to parse saved counters:', error);
      }
    }

    // Firebase integration would go here
    // For now, show setup if no data found
    setShowSetup(true);
  }, []);

  const handleCounterSelection = useCallback((counterId: string, isChecked: boolean) => {
    const newSelected = new Set(selectedCounters);
    
    if (isChecked) {
      if (newSelected.size >= 7) {
        return false; // Max limit reached
      }
      newSelected.add(counterId);
    } else {
      newSelected.delete(counterId);
      setCounterPrefixes(prev => {
        const updated = { ...prev };
        delete updated[counterId];
        return updated;
      });
    }
    
    setSelectedCounters(newSelected);
    return true;
  }, [selectedCounters]);

  const updatePrefix = useCallback((counterId: string, prefix: string) => {
    const cleanPrefix = prefix.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCounterPrefixes(prev => ({
      ...prev,
      [counterId]: cleanPrefix
    }));
  }, []);

  const validatePrefixes = useCallback(() => {
    const prefixes = Object.values(counterPrefixes);
    const validPrefixes = prefixes.every(p => p && /^[A-Z0-9]+$/.test(p));
    const uniquePrefixes = prefixes.length === new Set(prefixes).size;
    
    return validPrefixes && uniquePrefixes && selectedCounters.size > 0;
  }, [counterPrefixes, selectedCounters]);

  const saveSetup = useCallback(() => {
    console.log('🚀 [SETUP] Saving counter setup...');
    
    const setupData: Counters = {};
    Array.from(selectedCounters).forEach(counterId => {
      const prefix = counterPrefixes[counterId];
      setupData[counterId] = {
        prefix,
        nowServing: 1,
        lastIssued: 1
      };
    });

    localStorage.setItem('counters', JSON.stringify(setupData));
    setCurrentCounters(setupData);
    setShowSetup(false);
    console.log('🚀 [SETUP] Saved to localStorage');
  }, [selectedCounters, counterPrefixes]);

  const callNext = useCallback((counterId: string) => {
    console.log('🔔 [CALL] Calling next for:', counterId);
    
    const counter = currentCounters[counterId];
    if (!counter || counter.nowServing >= counter.lastIssued) {
      return false; // No customers waiting
    }

    const updatedCounters = {
      ...currentCounters,
      [counterId]: {
        ...counter,
        nowServing: counter.nowServing + 1
      }
    };

    setCurrentCounters(updatedCounters);
    localStorage.setItem('counters', JSON.stringify(updatedCounters));
    return true;
  }, [currentCounters]);

  const recallCurrent = useCallback((counterId: string) => {
    console.log('🔁 [RECALL] Recalling current for:', counterId);
    return true; // Just for feedback, no data change needed
  }, []);

  const skipCurrent = useCallback((counterId: string) => {
    console.log('⏭️ [SKIP] Skipping for:', counterId);
    
    const counter = currentCounters[counterId];
    if (!counter || counter.nowServing >= counter.lastIssued) {
      return false; // No customers to skip
    }

    const updatedCounters = {
      ...currentCounters,
      [counterId]: {
        ...counter,
        nowServing: counter.nowServing + 1
      }
    };

    setCurrentCounters(updatedCounters);
    localStorage.setItem('counters', JSON.stringify(updatedCounters));
    return true;
  }, [currentCounters]);

  const resetQueue = useCallback((counterId: string) => {
    console.log('🔄 [RESET] Resetting queue for:', counterId);
    
    const updatedCounters = {
      ...currentCounters,
      [counterId]: {
        ...currentCounters[counterId],
        nowServing: 1,
        lastIssued: 1
      }
    };

    setCurrentCounters(updatedCounters);
    localStorage.setItem('counters', JSON.stringify(updatedCounters));
  }, [currentCounters]);

  const backToSetup = useCallback(() => {
    setShowSetup(true);
  }, []);

  return {
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
  };
};