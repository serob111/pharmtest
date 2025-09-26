import React from 'react';
import { useGlobalLoading } from '../../../context/GlobalLoadingProvider';

const GlobalSpinner: React.FC = () => {
  const { isGlobalLoading } = useGlobalLoading();

  if (!isGlobalLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalSpinner;