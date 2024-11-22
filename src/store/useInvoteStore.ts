import { create } from "zustand";
interface invoteMemberType {
  candidates: string[];
  candidatesUrl: string[];
  candidatesPosition: string[];
  setCandidates: (arrProp: string[]) => void;
  setCandidatesUrl: (arrProp: string[]) => void;
  setCandidatesPosition: (arrProp: string[]) => void;
}
/** candidates, candidatesUrl, candidatesPosition, setCandidates, setCandidatesUrl, setCandidatesPosition*/
export const useInvoteStore = create<invoteMemberType>((set) => ({
  candidates: [], //모달로 전달할, 투표받을 멤버들
  candidatesUrl: [],
  candidatesPosition: [],

  setCandidates: (arrProp) =>
    set((state) => ({ candidates: [...state.candidates, ...arrProp] })),

  setCandidatesUrl: (arrProp) =>
    set((state) => ({ candidatesUrl: [...state.candidatesUrl, ...arrProp] })),

  setCandidatesPosition: (arrProp) =>
    set((state) => ({
      candidatesPosition: [...state.candidatesPosition, ...arrProp],
    })),
}));
