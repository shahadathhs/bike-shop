import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: null,
  setUser: (user: any) => {
    //* TODO: Implement user setting functionality
  },
  login: (user: any) => {
    //* TODO: Implement login functionality
  },
  logout: () => {
    //* TODO: Implement logout functionality
  },
});

export const useAuth = () => {
  return useContext(
    AuthContext as React.Context<{
      user: any;
      setUser: (user: any) => void;
      login: (user: any) => void;
      logout: () => void;
    }>
  );
};