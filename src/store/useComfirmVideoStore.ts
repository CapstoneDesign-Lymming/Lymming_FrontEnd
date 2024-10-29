import { create } from "zustand";
interface ConfirmVideoType{
    isConfirmVideo:boolean;
    setConfirmVideo:(confirm:boolean)=>void
}
const useConfirmVideoStore = create<ConfirmVideoType>((set)=>({
    isConfirmVideo:false,
    setConfirmVideo:(confirm:boolean)=>set({isConfirmVideo:confirm}),
}));
export default useConfirmVideoStore;