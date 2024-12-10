import { create } from "zustand";
import { createAuthSlice, AuthSlice } from "./slices/auth-slice";

type AppStore = AuthSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
}));
