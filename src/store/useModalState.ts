import { create } from "zustand";

interface ModalStore{
    isModalOpen:boolean;
    openModal:()=>void;
    closeModal:()=>void;
}
/**isModalOpen,openModal,closeModal */
const useModalStore = create<ModalStore>((set)=>({
    isModalOpen:false,
    openModal:()=>set({isModalOpen:true}),
    closeModal:()=>set({isModalOpen:false}),
}));
export default useModalStore;