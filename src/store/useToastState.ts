import { create } from "zustand";
interface ToastStore {
  isToastOpen: boolean;
  toastName: string;
  openToast: () => void;
  closeToast: () => void;
}
export const useToastStore = create<ToastStore>((set) => ({
  isToastOpen: false,
  toastName: "",
  openToast: () => set({ isToastOpen: true }),
  closeToast: () => set({ isToastOpen: false }),
}));
