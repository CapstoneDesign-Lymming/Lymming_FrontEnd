import { create } from "zustand";

export const useLoginStore = create((set) => ({
  login: false,
  count: 1,
  isOpen: false,
  setCount: () => set((state: any) => ({ count: state.count + 1 })),
  setIsOpen: () => set((state: any) => ({ isOpen: !state.isOpen })),
  setLogin: () => set((state: any) => ({ login: !state.login })),
}));
