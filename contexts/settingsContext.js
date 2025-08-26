import { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settingsHaveChanged, setSettingsHaveChanged] = useState(false);
  
  const markSettingsChanged = () => {
    setSettingsHaveChanged(true);
  };
  
  const resetSettingsChanged = () => {
    setSettingsHaveChanged(false);
  };
  
  return (
    <SettingsContext.Provider value={{
      settingsHaveChanged,
      markSettingsChanged,
      resetSettingsChanged
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}