import { create } from "zustand";
interface invoteMemberType {
  candidates: string[];
  setCandidates: (candidate: string[]) => void;
}
export const useInvoteStore = create<invoteMemberType>((set) => ({
  candidates: [],
  setCandidates: (candidate) =>
    set((state) => ({ candidates: [...state.candidate, candidate] })),
}));
