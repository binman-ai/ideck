import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { AuthState, User } from '../types';
import { config } from '../config';

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@ideck_user',
  TOKEN: '@ideck_token',
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Google Auth Configuration
  const googleAuthRequest = AuthSession.useAuthRequest({
    clientId: config.googleClientId,
    scopes: ['openid', 'profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'ideck',
      path: 'auth'
    }),
    responseType: AuthSession.ResponseType.Code,
    additionalParameters: {},
    extraParams: {
      access_type: 'offline',
    },
  }, {
    authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  });

  // LinkedIn Auth Configuration
  const linkedinAuthRequest = AuthSession.useAuthRequest({
    clientId: config.linkedinClientId,
    scopes: ['r_liteprofile', 'r_emailaddress'],
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'ideck',
      path: 'auth'
    }),
    responseType: AuthSession.ResponseType.Code,
    state: Crypto.getRandomBytes(16).toString('hex'),
  }, {
    authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      if (storedUser && storedToken) {
        const user: User = JSON.parse(storedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const result = await googleAuthRequest[1]?.promptAsync();
      
      if (result?.type === 'success') {
        const { code } = result.params;
        
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: config.googleClientId,
            code,
            grant_type: 'authorization_code',
            redirect_uri: AuthSession.makeRedirectUri({
              scheme: 'ideck',
              path: 'auth'
            }),
          }),
        });

        const tokens = await tokenResponse.json();
        
        // Get user info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        const googleUser = await userResponse.json();
        
        // Create user object
        const user: User = {
          id: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          profilePicture: googleUser.picture,
          provider: 'google',
          createdAt: new Date(),
        };

        // Store user and token
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, tokens.access_token);

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signInWithLinkedIn = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const result = await linkedinAuthRequest[1]?.promptAsync();
      
      if (result?.type === 'success') {
        const { code } = result.params;
        
        // Exchange code for tokens
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: config.linkedinClientId,
            code,
            grant_type: 'authorization_code',
            redirect_uri: AuthSession.makeRedirectUri({
              scheme: 'ideck',
              path: 'auth'
            }),
          }),
        });

        const tokens = await tokenResponse.json();
        
        // Get user profile
        const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        // Get user email
        const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        const profile = await profileResponse.json();
        const emailData = await emailResponse.json();
        
        const user: User = {
          id: profile.id,
          email: emailData.elements[0]['handle~'].emailAddress,
          name: `${profile.firstName.localized.en_US} ${profile.lastName.localized.en_US}`,
          profilePicture: profile.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier,
          provider: 'linkedin',
          createdAt: new Date(),
        };

        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, tokens.access_token);

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('LinkedIn sign in error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch(`${config.apiBaseUrl}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      const { user, token } = data;

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Email sign in error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch(`${config.apiBaseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      const { user, token } = data;

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Email sign up error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN]);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) return;

      const response = await fetch(`${config.apiBaseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        setAuthState(prev => ({ ...prev, user }));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    signInWithGoogle,
    signInWithLinkedIn,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};