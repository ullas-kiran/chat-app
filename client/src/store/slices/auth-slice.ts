import { User } from "@/types";
import { StateCreator } from "zustand";

export interface AuthSlice {
  userInfo: User | undefined; 
  setUserInfo: (userInfo: User | undefined) => void; 
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set({ userInfo }),
});
