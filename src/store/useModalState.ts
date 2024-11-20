import { create } from "zustand";

interface ModalStore {
  isModalOpen: boolean;
  modalName: string;
  postSharePageId: null | number;
  openModal: () => void;
  closeModal: () => void;
  setPosetSharePageId: (id: number) => void;
}
/**isModalOpen,openModal,closeModal */
const useModalStore = create<ModalStore>((set) => ({
  isModalOpen: false,
  modalName: "",
  postSharePageId: null,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setPosetSharePageId: (id: number) => set({ postSharePageId: id }),
}));
export default useModalStore;
