import { create } from "zustand";

interface MemberProjectState {
  nickname: string;
  projectNames: string[];
  deadlines: string[];
  setNickName: (nickname: string) => void;
  setProjectNames: (arrProp: string[]) => void;
  setDeadlines: (arrProp: string[]) => void;
}

const useMemberProjectStore = create<MemberProjectState>((set) => ({
  nickname: "_",
  projectNames: [],
  deadlines: [],
  setNickName: (nickname: string) => set({ nickname: nickname }),
  setProjectNames: (arrProp) => set({ projectNames: [...arrProp] }),
  setDeadlines: (arrProp) => set({ deadlines: [...arrProp] }),
}));

export default useMemberProjectStore;
