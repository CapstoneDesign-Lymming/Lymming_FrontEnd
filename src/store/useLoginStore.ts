import { create } from "zustand";
import UserInfo from "../interfaces/user";
import { persist } from "zustand/middleware";
interface LoginState {
  login: boolean;
  count: number;
  isOpen: boolean;
  isExist: boolean;

  setCount: () => void;
  setCountDown: () => void;
  setCountReset: () => void;
  setIsOpen: () => void;
  setIsOpenReset: () => void;
  setLogin: () => void;
  setIsExist: () => void;
  setIsExistReset: () => void;
}

interface InfoState {
  data: UserInfo;
  setData: (newData: Partial<UserInfo>) => void;
  resetData: () => void; // resetData 메서드를 추가합니다.
}

// 로그인 data
export const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      login: false,
      count: 1,
      isOpen: false,
      //닉네임 중복체크
      isExist: false,
      setCount: () => set((state) => ({ count: state.count + 1 })),
      setCountDown: () => set((state) => ({ count: state.count - 1 })),
      setIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setLogin: () => set((state) => ({ login: !state.login })),
      setIsExist: () => set((state) => ({ isExist: !state.isExist })),
      setCountReset: () => set(() => ({ count: 1 })),
      setIsOpenReset: () => set(() => ({ isOpen: false })),
      setIsExistReset: () => set(() => ({ isExist: false })),
    }),
    {
      name: "loginState", // 로컬 스토리지에 저장될 키 이름
    }
  )
);

// 회원 정보 입력 data
export const useInfoStore = create<InfoState>()(
  persist(
    (set) => ({
      data: {
        userId: 0,
        bio: "",
        favorites: 0,
        gender: "",
        serverNickname: "",
        job: "",
        loginType: "",
        nickname: "",
        position: "",
        stack: "html, react, node.js, typescript, javascript",
        temperature: 0,
        userImg: "",
        keyCode: "",
        uid: 0,
        work_time: "",
        working_team: "",
        devStyle: "",
        with_people: "",
        developerType: 0,
      },

      setData: (newData: Partial<UserInfo>) =>
        set((state) => {
          console.log("Updating data with:", newData);
          return { data: { ...state.data, ...newData } };
        }),

      // 모든 데이터를 초기값으로 되돌리는 메서드
      resetData: () =>
        set({
          data: {
            userId: 0,
            bio: "",
            favorites: 0,
            gender: "",
            serverNickname: "",
            job: "",
            loginType: "",
            nickname: "",
            position: "",
            stack: "",
            temperature: 0,
            userImg: "",
            keyCode: "",
            uid: 0,
            work_time: "",
            working_team: "",
            devStyle: "",
            with_people: "",
            developerType: 0,
          },
        }),
    }),
    {
      name: "userData", // 로컬 스토리지에 저장될 키 이름
    }
  )
);
