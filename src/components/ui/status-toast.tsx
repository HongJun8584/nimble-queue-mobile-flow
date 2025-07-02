import { useState, useEffect } from 'react';

interface StatusToastProps {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  isVisible: boolean;
  onHide: () => void;
}

export const StatusToast = ({ message, type, isVisible, onHide }: StatusToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800'
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm border-l-4 ${typeStyles[type]} animate-in slide-in-from-right duration-300`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};