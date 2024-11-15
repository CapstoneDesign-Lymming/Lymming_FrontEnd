import { useEffect, useState } from "react";
import { useInfoStore, useLoginStore } from "../../../store/useLoginStore";
import "./LoginInfoModalChild.scss";
import infoData from "../../../data/loginInfoData.json";
import loginok from "../../../assets/img/loginok.png";
import nouserImage from "../../../assets/img/no-profile.webp";
import axios from "axios";
import useImageUpload from "../../../hooks/useImageUpload";

export const Child1 = () => {
  const { setData } = useInfoStore();
  const { setIsExist } = useLoginStore();
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

    // 임시 true => isExist
    if (true === true) {
      window.alert("사용가능한 닉네임입니다");
      // 임시로 사용 가능 아이디 허용
      setIsExist();
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
        <input onChange={onChange} name="nickname" />
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
            value="MALE"
            onChange={onChange}
          />
          <label className="q2-box-item" htmlFor="male">
            남성
          </label>

          <input
            type="radio"
            id="female"
            name="gender"
            value="FEMALE"
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
    setData({ stack: skills });
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
    setData({ interests: interest });
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
    console.log(name);
    console.log(value);
    setData({ [name]: value });
  };
  return (
    <div className="Child4">
      <div className="title">작업이 더 잘되는 시간은?</div>
      <div className="time">
        <div className="time-top">
          <input
            type="radio"
            id="새벽"
            name="work_time"
            value="day"
            onChange={onChange}
          />
          <label className="time-top-item" htmlFor="새벽">
            새벽
          </label>
          <input
            type="radio"
            id="오전"
            name="work_time"
            value="night"
            onChange={onChange}
          />
          <label className="time-top-item" htmlFor="오전">
            오전
          </label>
        </div>
        <div className="time-bottom">
          <input
            type="radio"
            id="오후"
            name="work_time"
            value="day"
            onChange={onChange}
          />
          <label className="time-bottom-item" htmlFor="오후">
            오후
          </label>
          <input
            type="radio"
            id="밤"
            name="work_time"
            value="night"
            onChange={onChange}
          />
          <label className="time-bottom-item" htmlFor="밤">
            밤
          </label>
        </div>
      </div>
    </div>
  );
};

export const Child5 = () => {
  const { setData } = useInfoStore();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store에서 setData 가져오기
    const name = e.target.name;
    const value = e.target.value; // 입력된 값 가져오기
    console.log(name);
    console.log(value);
    setData({ [name]: value });
  };
  return (
    <div className="Child4">
      <div className="title">팀원과 작업 할때</div>
      <div className="time">
        <div className="time-top">
          <input
            type="radio"
            id="독립적으로"
            name="working_team"
            value="독립적으로"
            onChange={onChange}
          />
          <label className="time-top-item" htmlFor="독립적으로">
            독립적으로
          </label>
          <input
            type="radio"
            id="온라인 선호"
            name="working_team"
            value="온라인 선호"
            onChange={onChange}
          />
          <label className="time-top-item" htmlFor="온라인 선호">
            온라인 선호
          </label>
        </div>
        <div className="time-bottom">
          <input
            type="radio"
            id="팀과함께"
            name="working_team"
            value="팀과함께"
            onChange={onChange}
          />
          <label className="time-bottom-item" htmlFor="팀과함께">
            팀과함께
          </label>
          <input
            type="radio"
            id="오프라인 선호"
            name="working_team"
            value="오프라인 선호"
            onChange={onChange}
          />
          <label className="time-bottom-item" htmlFor="오프라인 선호">
            오프라인 선호
          </label>
        </div>
      </div>
    </div>
  );
};

export const Child6 = () => {
  const { setData } = useInfoStore();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store에서 setData 가져오기
    const name = e.target.name;
    const value = e.target.value; // 입력된 값 가져오기
    console.log(name);
    console.log(value);
    setData({ [name]: value });
  };
  return (
    <div className="Child4">
      <div className="title">작업할 때 선호하는 방식</div>
      <div className="time">
        <div className="time-top">
          <input
            type="radio"
            id="즉흥적"
            name="devStyle"
            value="즉흥적"
            onChange={onChange}
          />
          <label className="time-top-item" htmlFor="즉흥적">
            즉흥적
          </label>
          <input
            type="radio"
            id="계획적"
            name="devStyle"
            value="계획적"
            onChange={onChange}
          />
          <label className="time-top-item" htmlFor="계획적">
            계획적
          </label>
        </div>
        <div className="time-bottom">
          <input
            type="radio"
            id="단기 프로젝트"
            name="devStyle"
            value="단기 프로젝트"
            onChange={onChange}
          />
          <label className="time-bottom-item" htmlFor="단기 프로젝트">
            단기 프로젝트
          </label>
          <input
            type="radio"
            id="장기 프로젝트"
            name="devStyle"
            value="장기 프로젝트"
            onChange={onChange}
          />
          <label className="time-bottom-item" htmlFor="장기 프로젝트">
            장기 프로젝트
          </label>
        </div>
      </div>
    </div>
  );
};

export const Child7 = () => {
  const { setData } = useInfoStore();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store에서 setData 가져오기
    const name = e.target.name;
    const value = e.target.value; // 입력된 값 가져오기
    console.log(name);
    console.log(value);
    setData({ [name]: value });
  };

  return (
    <div className="Child4">
      <div className="title">사람들과 함께 있을때 나는</div>
      <div className="time">
        <div className="time-top">
          <input
            type="radio"
            id="조용한 리더"
            name="with_people"
            value="조용한 리더"
            onChange={onChange}
          />
          <label className="time-top-item" htmlFor="조용한 리더">
            조용한 리더
          </label>
          <input
            type="radio"
            id="활발한 리더"
            name="with_people"
            value="활발한 리더"
            onChange={onChange}
          />
          <label className="time-top-item" htmlFor="활발한 리더">
            활발한 리더
          </label>
        </div>
        <div className="time-bottom">
          <input
            type="radio"
            id="조용한 보조"
            name="with_people"
            value="조용한 보조"
            onChange={onChange}
          />
          <label className="time-bottom-item" htmlFor="조용한 보조">
            조용한 보조
          </label>
          <input
            type="radio"
            id="활발한 보조"
            name="with_people"
            value="활발한 보조"
            onChange={onChange}
          />
          <label className="time-bottom-item" htmlFor="활발한 보조">
            활발한 보조
          </label>
        </div>
      </div>
    </div>
  );
};

export const Child8 = () => {
  const { imageUrl, handleFileChange, handleUpload } = useImageUpload();
  const { data, setData } = useInfoStore();
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Store에서 setData 가져오기
    const name = e.target.name;
    const value = e.target.value; // 입력된 값 가져오기
    setData({ [name]: value });
  };
  const saveShareDetail = async () => {
    console.log("saveShareDetail함수 내부");
    const s3ImageUrl = await handleUpload();
    setData({ userImg: s3ImageUrl });
    console.log("🥇setData로 userImg세팅", data.userImg);
    // postUplodFileUrl(s3ImageUrl);
  };
  try {
    saveShareDetail();
    console.log("saveShareDetail");
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="Child9">
      <div className="title">프로필을 설정해주세요</div>

      <div className="img">
        <img src={imageUrl || nouserImage} />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
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
        <textarea name="bio" onChange={onChange} />
      </div>
    </div>
  );
};

export const Child9 = () => {
  return (
    <div className="Child9">
      <img src={loginok} />
      <div className="title">회원가입 완료</div>

      <div className="intro">이제 리밍을 마음껏 이용해 보세요</div>
    </div>
  );
};
