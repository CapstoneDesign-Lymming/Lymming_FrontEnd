import { useEffect, useState } from "react";
import { useInfoStore, useLoginStore } from "../../../store/useLoginStore";
import "./LoginInfoModalChild.scss";
import infoData from "../../../data/loginInfoData.json";
import loginok from "../../../assets/img/loginok.png";
import nouserImage from "../../../assets/img/no-profile.webp";
import axios from "axios";

export const Child1 = () => {
  const { setData } = useInfoStore();
  const { isExist, setIsExist } = useLoginStore();
  const [name, setName] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store에서 setData 가져오기
    const name = e.target.name;
    const value = e.target.value; // 입력된 값 가져오기

    if (name === name) {
      setName(value);
    }

    setData({ [name]: value });
  };

  const onNameCheck = () => {
    // 아이디 중복체크
    getUserName();

    if (isExist === true) {
      window.alert("사용가능한 닉네임입니다");
    } else {
      window.alert("이미 사용중인 닉네임입니다");
    }
  };

  // 서버에서 닉네임으로 이미 사용자가 존재하는지 체크
  const getUserName = async () => {
    try {
      const res = await axios.get("", { params: { nickname: name } });
      if (res.data === true) {
        setIsExist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="Child1">
      <div className="q1">
        <span>닉네임을 입력해 주세요</span>
        <input onChange={onChange} name="name" />
        <button className="q1-namecheck" onClick={onNameCheck}>
          중복확인
        </button>
      </div>

      <div className="q2">
        <span>성별을 선택해주세요</span>

        <div className="q2-box">
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            onChange={onChange}
          />
          <label className="q2-box-item" htmlFor="male">
            남성
          </label>

          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            onChange={onChange}
          />
          <label className="q2-box-item" htmlFor="female">
            여성
          </label>
        </div>
      </div>

      <div className="q3">
        <span>직업을 선택해주세요</span>

        <div className="q3-box">
          <input
            type="radio"
            id="std"
            name="job"
            value="std"
            onChange={onChange}
          />
          <label className="q3-box-item" htmlFor="std">
            학생
          </label>

          <input
            type="radio"
            id="ca"
            name="job"
            value="ca"
            onChange={onChange}
          />
          <label className="q3-box-item" htmlFor="ca">
            직장인
          </label>

          <input
            type="radio"
            id="etc"
            name="job"
            value="etc"
            onChange={onChange}
          />
          <label className="q3-box-item" htmlFor="etc">
            기타
          </label>
        </div>
      </div>

      <div className="q4">
        <span>직종을 선택해주세요</span>

        <div className="q4-box">
          <input
            type="radio"
            id="dev"
            name="category"
            value="dev"
            onChange={onChange}
          />
          <label className="q4-box-item" htmlFor="dev">
            개발
          </label>

          <input
            type="radio"
            id="head"
            name="category"
            value="head"
            onChange={onChange}
          />
          <label className="q4-box-item" htmlFor="head">
            기획
          </label>

          <input
            type="radio"
            id="desgin"
            name="category"
            value="desgin"
            onChange={onChange}
          />
          <label className="q4-box-item" htmlFor="desgin">
            디자인
          </label>
        </div>
      </div>
    </div>
  );
};

export const Child2 = () => {
  const { setData } = useInfoStore();
  const [skills, setSkills] = useState<string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값 가져오기

    if (e.target.checked) {
      setSkills((prev) => [...prev, value]);
    } else {
      setSkills((prev) => prev.filter((skill) => skill != value));
    }
  };

  useEffect(() => {
    setData({ skills });
  }, [skills]);

  return (
    <div className="Child2">
      <div className="title">스킬 및 도구를 선택하세요</div>
      <div className="skills">
        {infoData.skills.map((it) => {
          return (
            <>
              <input type="checkbox" id={it} value={it} onChange={onChange} />
              <label className="skills-item" htmlFor={it}>
                {it}
              </label>
            </>
          );
        })}
      </div>
    </div>
  );
};

export const Child3 = () => {
  const [interest, setInterest] = useState<string[]>([]);
  const { setData } = useInfoStore();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // 입력된 값 가져오기

    if (e.target.checked) {
      setInterest((prev) => [...prev, value]);
    } else {
      setInterest((prev) => prev.filter((interest) => interest != value));
    }
  };

  useEffect(() => {
    setData({ interest });
  }, [interest]);
  return (
    <div className="Child2">
      <div className="title">관심 있는 분야를 선택하세요</div>
      <div className="skills">
        {infoData.interest.map((it) => {
          return (
            <>
              <input type="checkbox" id={it} value={it} onChange={onChange} />
              <label className="skills-item" htmlFor={it}>
                {it}
              </label>
            </>
          );
        })}
      </div>
    </div>
  );
};
export const Child4 = () => {
  const { setData } = useInfoStore();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store에서 setData 가져오기
    const name = e.target.name;
    const value = e.target.value; // 입력된 값 가져오기

    setData({ [name]: value });
  };
  return (
    <div className="Child4">
      <div className="title">작업이 더 잘되는 시간은?</div>
      <div className="time">
        <input
          type="radio"
          id="day"
          name="time"
          value="day"
          onChange={onChange}
        />
        <label className="time-item" htmlFor="day">
          낮
        </label>

        <input
          type="radio"
          id="night"
          name="time"
          value="night"
          onChange={onChange}
        />
        <label className="time-item" htmlFor="night">
          밤
        </label>
      </div>
    </div>
  );
};

export const Child5 = () => {
  const { setData } = useInfoStore();

  const [image, setImage] = useState<string | null>(null); // 이미지 URL을 저장할 상태

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file); // 선택한 파일의 URL 생성
      setImage(imageUrl); // 이미지 상태 업데이트
      setData({ profileImage: imageUrl });
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Store에서 setData 가져오기
    const name = e.target.name;
    const value = e.target.value; // 입력된 값 가져오기

    setData({ [name]: value });
  };
  return (
    <div className="Child5">
      <div className="title">프로필을 설정해주세요</div>

      <div className="img">
        <img src={image || nouserImage} />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="image-upload"
          name="profileImage"
        />
        <button
          className="img-add"
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          +
        </button>
      </div>

      <div className="intro">
        <span>자신을 소개해주세요</span>
        <textarea name="introduce" onChange={onChange} />
      </div>
    </div>
  );
};

export const Child6 = () => {
  return (
    <div className="Child6">
      <img src={loginok} />
      <div className="title">회원가입 완료</div>

      <div className="intro">이제 리밍을 마음껏 이용해 보세요</div>
    </div>
  );
};
