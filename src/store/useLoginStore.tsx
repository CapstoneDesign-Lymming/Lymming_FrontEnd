import { create } from "zustand";

// 로그인 data
export const useLoginStore = create((set) => ({
  login: false,
  count: 1,
  isOpen: false,
  setCount: () => set((state: any) => ({ count: state.count + 1 })),
  setIsOpen: () => set((state: any) => ({ isOpen: !state.isOpen })),
  setLogin: () => set((state: any) => ({ login: !state.login })),
}));

// 회원 정보 입력 data
export const useInfoStore = create((set) => ({
  data: {
    name: "",
    gender: "",
    job: "",
    category: "",
    skills: [],
    interest: [],
    time: "",
    introduce: "",
  },

  setData: (newData: any) =>
    set((state: any) => ({ data: { ...state.data, ...newData } })),
}));
