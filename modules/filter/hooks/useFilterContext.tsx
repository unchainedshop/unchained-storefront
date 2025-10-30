'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextValue {
  formState: Record<string, string[]>;
  setFilterValues: (name: string, values: string[]) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState<Record<string, string[]>>({});

  const setFilterValues = (name: string, values: string[]) => {
    setFormState((prev) => ({ ...prev, [name]: values }));
  };

  const resetFilters = () => setFormState({});

  return (
    <FilterContext.Provider
      value={{ formState, setFilterValues, resetFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default function useFilterContext() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return ctx;
}
