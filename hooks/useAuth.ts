// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import * as authService from '../services/auth';
import { UserRole, AuthUser } from '../types/user';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        // Get the ID token to check custom claims
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const role = idTokenResult.claims.role as UserRole;
        
        console.log('User role:', role);
        
        if (role === 'patient' || role === 'physician') {
          console.log(`Valid ${role} user logged in`);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: role
          });
          setIsAuthenticated(true);
        } else {
          console.log('Invalid role, signing out');
          await authService.signOut();
          setUser(null);
          setIsAuthenticated(false);
          setError('Access denied: Invalid role');
        }
      } else {
        console.log('User logged out');
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await authService.signIn(email, password);
    } catch (err: any) {
      console.log('Sign in error:', err.message);
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
      setIsAuthenticated(false);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated,
    userRole: user?.role || null,  // Add this to match RootNavigator's expectations
    isPhysician: user?.role === 'physician',
    isPatient: user?.role === 'patient',
  };
};