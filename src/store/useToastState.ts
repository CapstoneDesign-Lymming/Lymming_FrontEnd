import { create } from "zustand";

interface ToastStore {
  isToastOpen: boolean;
  toastName: string;
  successText: string;
  errorText: string;
  openToast: () => void;
  closeToast: () => void;
  setErrorText: (str: string) => void;
  setSuccessText: (str: string) => void;
}
/**isToastOpen, toastName, successText, errorText, openToast, closeToastsetSuccessText, setErrorText */
export const useToastStore = create<ToastStore>((set) => ({
  isToastOpen: false,
  toastName: "",
  successText: "",
  errorText: "",
  openToast: () => set({ isToastOpen: true }),
  closeToast: () => set({ isToastOpen: false }),
  setSuccessText: (str) => set({ successText: str }),
  setErrorText: (str) => set({ errorText: str }),
}));
