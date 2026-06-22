import { useContext } from 'react';
import { AuthStateContext } from './AuthStateContext';

export function useAuth() {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
