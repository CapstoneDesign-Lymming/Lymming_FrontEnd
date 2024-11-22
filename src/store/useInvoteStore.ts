import { create } from "zustand";
interface invoteMemberType {
  candidates: string[];
  setCandidates: (arrProp: string[]) => void;
}
/** candidates, setCandidates*/
export const useInvoteStore = create<invoteMemberType>((set) => ({
  candidates: [], //모달로 전달할, 투표받을 멤버들
  setCandidates: (arrProp) =>
    set((state) => ({ candidates: [...state.candidates, ...arrProp] })),
}));
