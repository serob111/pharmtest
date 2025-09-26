import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

type TProps = {
  children: ReactNode;
};

type TGlobalLoadingContext = {
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  addLoadingSource: (source: string) => void;
  removeLoadingSource: (source: string) => void;
};

const GlobalLoadingContext = createContext<TGlobalLoadingContext>({} as TGlobalLoadingContext);

export const GlobalLoadingProvider = ({ children }: TProps) => {
  const [loadingSources, setLoadingSources] = useState<Set<string>>(new Set());

  const addLoadingSource = (source: string) => {
    setLoadingSources(prev => new Set(prev).add(source));
  };

  const removeLoadingSource = (source: string) => {
    setLoadingSources(prev => {
      const newSet = new Set(prev);
      newSet.delete(source);
      return newSet;
    });
  };

  const setGlobalLoading = (loading: boolean) => {
    if (loading) {
      addLoadingSource('global');
    } else {
      removeLoadingSource('global');
    }
  };

  const contextValue = useMemo(() => ({
    isGlobalLoading: loadingSources.size > 0,
    setGlobalLoading,
    addLoadingSource,
    removeLoadingSource,
  }), [loadingSources.size]);

  return (
    <GlobalLoadingContext.Provider value={contextValue}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  return useContext(GlobalLoadingContext);
};