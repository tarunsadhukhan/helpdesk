import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthState, LoginCredentials, LoginResponse, User } from '../types';
import { loginUser } from '../services/api';
 

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  let user = null;

  try {

   
    const userData = localStorage.getItem('user');


    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Validate user data structure using type_of_user instead of role
      if (parsedUser.id && parsedUser.username && typeof parsedUser.type_of_user === 'number') {
        user = parsedUser;
      }
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return {
    isLoggedIn: Boolean(token && user),
    user
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(getInitialState());

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await loginUser(credentials);
      
      // Store the token and user data
      localStorage.setItem('token', response.token);
  //   localStorage.setItem('user', JSON.stringify(response.user));
//     console.log('pp',response.user[0])
    const userData = localStorage.getItem('user');
      console.log('user local',userData)
      console.log('pro res',response.response.user)


      const userx = response.user;
    //  console.log(userx.email)

      // Now you can access individual properties
    //  console.log("User ID:", userx.id);            // Outputs: 2
   //   console.log("Username:", userx.username); 

      setState({
        isLoggedIn: true,
        user: response.response.user,
      });
      
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({
      isLoggedIn: false,
      user: null,
    });
  }, []);

  const value = {
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;