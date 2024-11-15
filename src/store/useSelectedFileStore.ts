import { create } from "zustand";
interface SelectedFileStore {
  globalSelectedFile: File | null;
  setGlobalSelectedFile: (file: File | null) => void;
}
const useSelectedFileStore = create<SelectedFileStore>((set) => ({
  globalSelectedFile: null,
  setGlobalSelectedFile: (file) => set({ globalSelectedFile: file }),
}));

export default useSelectedFileStore;
