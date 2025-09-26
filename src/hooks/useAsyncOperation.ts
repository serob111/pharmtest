import { useState, useCallback } from 'react';
import { useGlobalLoading } from '../context/GlobalLoadingProvider';

interface UseAsyncOperationOptions {
  loadingSource?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useAsyncOperation<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  options: UseAsyncOperationOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { addLoadingSource, removeLoadingSource } = useGlobalLoading();

  const execute = useCallback(async (...args: Parameters<T>) => {
    setLoading(true);
    setError(null);
    
    if (options.loadingSource) {
      addLoadingSource(options.loadingSource);
    }

    try {
      const result = await operation(...args);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      options.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
      if (options.loadingSource) {
        removeLoadingSource(options.loadingSource);
      }
    }
  }, [operation, options, addLoadingSource, removeLoadingSource]);

  return {
    execute,
    loading,
    error,
    clearError: () => setError(null),
  };
}