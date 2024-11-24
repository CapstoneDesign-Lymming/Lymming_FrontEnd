import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeamBuilding.scss";
import Header from "../../components/header/Header";
import useImageUpload from "../../hooks/useImageUpload";
import { useInfoStore } from "../../store/useLoginStore";
import imgs from "../../assets/img/noimage.jpg";
import skills from "../../data/skills.json";
import { useToastStore } from "../../store/useToastState";
import RootToast from "../../components/Toast/RootToast/RootToast";

interface State {
  studyType: string;
  recruitmentCount: number;
  studyMethod: string;
  projectDuration: string;
  deadline: string;
  recruitmentField: string;
  workType: string;
  projectName: string;
  projectImg: string;
  description: string;
  techStack: string;
}

const TeamBuilding = () => {
  const navigate = useNavigate();
  const imgRef = useRef<HTMLInputElement | null>(null);
  const localProjectImg = useRef<string>("");
  const { data } = useInfoStore();
  const [state, setState] = useState<State>({
    studyType: "",
    recruitmentCount: 0,
    studyMethod: "",
    projectDuration: "",
    deadline: "",
    recruitmentField: "",
    workType: "",
    projectName: "",
    projectImg: "",
    description: "",
    techStack: "",
  });
  const { imageUrl, handleFileChange, handleUpload } = useImageUpload();
  const [toastName, setToastName] = useState("");
  const { isToastOpen, openToast, setErrorText } = useToastStore();
  // 기술 선택 배열
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const requiredFields = [
    { field: "studyType", message: "모집 구분을 선택하세요." },
    { field: "recruitmentCount", message: "모집 인원을 입력하세요." },
    { field: "studyMethod", message: "진행 방식을 선택하세요." },
    { field: "projectDuration", message: "기간을 선택하세요." },
    { field: "deadline", message: "마감 날짜를 선택하세요." },
    { field: "recruitmentField", message: "포지션을 입력하세요." },
    { field: "workType", message: "스타일을 선택하세요." },
    { field: "projectName", message: "제목을 입력하세요." },
    // { field: "projectImg", message: "이미지를 첨부하세요." },
    { field: "description", message: "내용을 입력하세요." },
    { field: "techStack", message: "기술을 입력하세요." },
  ];
  const onBtnClick = () => {
    if (imgRef.current) {
      imgRef.current.click();
    }
  };

  const onChange = (e: any) => {
    const target = e.target;
    if (target) {
      const value =
        target.name === "recruitmentCount"
          ? parseInt(target.value, 10)
          : target.value;
      setState({ ...state, [target.name]: value });
      console.log(state.projectImg);
    }
  };

  // const onSkillsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedOptions = Array.from(
  //     e.target.selectedOptions,
  //     (option) => option.value
  //   );

  //   setState({ ...state, techStack: selectedOptions.join(", ") });
  //   console.log(state.projectImg);
  // };

  const onSkillClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      // 체크된 경우 배열에 추가
      setSelectedSkills((prev) => [...prev, value]);
    } else {
      // 체크 해제된 경우 배열에서 제거
      setSelectedSkills((prev) => prev.filter((skill) => skill !== value));
    }
  };

  useEffect(() => {
    setState({ ...state, techStack: selectedSkills.join(", ") });
  }, [selectedSkills]);

  const postProject = async () => {
    try {
      console.log("❌5");

      const res = await axios.post("https://lymming-back.link/teambuild", {
        userId: data.userId,
        studyType: state.studyType,
        recruitmentCount: state.recruitmentCount,
        studyMethod: state.studyMethod,
        projectDuration: state.projectDuration,
        projectImg: localProjectImg.current,
        projectName: state.projectName,
        recruitmentField: state.recruitmentField,
        techStack: state.techStack,
        workType: state.workType,
        deadline: state.deadline,
        description: state.description,
        uploadTime: new Date().toISOString().substring(0, 10),
      });
      if (res.status === 200) {
        console.log(res);
        openToast();
        setToastName("successToast");
        navigate("/participate");
        console.log("❌6 등록 완료");
        return;
      } else {
        throw new Error(`서버 오류: ${res.status}`);
      }
    } catch (e) {
      console.error(e);
      setToastName("errorToast");
      openToast();
      setErrorText("등록에 실패하였습니다");
    }
  };

  const onsubmit = async () => {
    for (const { field, message } of requiredFields) {
      if (!state[field as keyof State]) {
        window.alert(message);
        return;
      }
    }

    postProject();
  };

  const uploadImage = async () => {
    console.log("💧💧💧");
    const s3ImageUrl = await handleUpload();
    if (s3ImageUrl) {
      localProjectImg.current = s3ImageUrl;
      console.log("👍ref로 선언한 localProjectImg", localProjectImg.current); //이미지 경로 들어감
    }
    if (s3ImageUrl) {
      console.log("s3ImageUrl", s3ImageUrl);
      console.log(state.projectImg, "state에 이미지 추가");
      // postUplodFileUrl(s3ImageUrl);
      setState({ ...state, projectImg: localProjectImg.current });

      console.log("⭐setState이후 이미지 경로", state.projectImg);
    } else {
      console.error("Image upload failed; URL is undefined");
    }
  };

  return (
    <>
      <Header />
      <div className="TeamBuilding">
        <div className="content">
          <h2 className="content-title_h2">프로젝트 정보를 입력해주세요</h2>
          <div className="content-top">
            <div className="content-top-left">
              <span className="content-top-left-title">모집 구분</span>
              <div className="content-top-left-body">
                <div className="content-top-left-body-box">
                  <input
                    type="radio"
                    id="project"
                    name="studyType"
                    onChange={onChange}
                    value="프로젝트"
                  />
                  <label htmlFor="project">프로젝트</label>
                </div>
                <div className="content-top-left-body-box">
                  <input
                    type="radio"
                    name="studyType"
                    id="study"
                    onChange={onChange}
                    value="스터디"
                  />
                  <label htmlFor="study">스터디</label>
                </div>
              </div>
            </div>
            <div className="content-top-right">
              <div className="content-top-right-1">
                <span>모집 인원</span>
                <select
                  onChange={onChange}
                  className="recruitmentCount"
                  name="recruitmentCount"
                >
                  <option value="">선택</option>
                  <option value="1">1명</option>
                  <option value="2">2명</option>
                  <option value="3">3명</option>
                  <option value="4">4명</option>
                  <option value="5">5명</option>
                </select>
              </div>
              <div className="content-top-right-2">
                <span>진행 방식</span>
                <select
                  onChange={onChange}
                  name="studyMethod"
                  className="recruitmentCount"
                >
                  <option value="" disabled hidden>
                    선택하세요
                  </option>
                  <option value="">선택</option>
                  <option value="온라인">온라인</option>
                  <option value="오프라인">오프라인</option>
                  <option value="혼합">혼합</option>
                </select>
              </div>
            </div>
          </div>

          <div className="content-center">
            <div className="content-center-left">
              <span>프로젝트 기간</span>
              <select onChange={onChange} name="projectDuration">
                <option value="">선택</option>
                <option value="1달 이하">1달 이하</option>
                <option value="1달">1달</option>
                <option value="3개월">3개월</option>
                <option value="6개월">6개월</option>
                <option value="1년 이상">1년 이상</option>
              </select>
            </div>
            <div className="content-center-right">
              <span>모집 마감일</span>
              <input type="date" onChange={onChange} name="deadline" />
            </div>
          </div>
          <div className="content-center">
            <div className="content-center-left">
              <span>모집 포지션</span>
              <select onChange={onChange} name="recruitmentField">
                <option value="">선택</option>
                <option value="프론트">프론트</option>
                <option value="백엔드">백엔드</option>
                <option value="ai">ai</option>
                <option value="게임">게임</option>
                <option value="디자이너">디자이너</option>
                <option value="기획">기획</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div className="content-center-right">
              <span>원하는 개발 스타일</span>
              <select onChange={onChange} name="workType">
                <option value="">선택</option>
                <option value="열정적">열정적</option>
                <option value="독립적">독립적</option>
                <option value="성실">성실</option>
              </select>
            </div>
          </div>

          <div className="content-skills">
            <span>모집 스킬</span>

            <div className="content-skills-item">
              {skills.skills.map((item, index) => (
                <React.Fragment key={index}>
                  <input
                    type="checkbox"
                    id={item.name}
                    value={item.name}
                    onChange={onSkillClick}
                    checked={selectedSkills.includes(item.name)}
                  />
                  <div key={item.name} className="wrapper">
                    <img src={item.url} className="skill_icon" />

                    <label htmlFor={item.name} className={"skill_name"}>
                      {item.name}
                    </label>
                  </div>
                </React.Fragment>
              ))}
            </div>
            {/* 
            <select onChange={onSkillsChange} name="techStack" multiple>
              <option value="">선택</option>
              {skills.skills.map((it, index) => {
                return (
                  <option value={it.name} key={index}>
                    {it.name}
                  </option>
                );
              })}
            </select> */}
          </div>
          <div className="input_title">
            <span>제목</span>
            <input
              type="text"
              placeholder="제목을 입력해 주세요"
              onChange={onChange}
              name="projectName"
            />
          </div>

          <div className="input_img">
            <span>이미지 첨부</span>
            <input
              type="file"
              accept="image/*"
              ref={imgRef}
              onChange={handleFileChange}
              name="projectImg"
            />
            <img src={imageUrl || imgs}></img>
            <button onClick={onBtnClick}>사진추가</button>
          </div>

          <div className="input_content">
            <span>내용</span>
            <textarea
              placeholder="내용을 입력해 주세요."
              name="description"
              onChange={onChange}
            />
          </div>

          <div className="btn_wrapper">
            <button className="cancel" onClick={() => navigate("/participate")}>
              취소
            </button>
            <button
              className="submit"
              onClick={() => {
                uploadImage().then(() => onsubmit());
              }}
            >
              등록
            </button>
          </div>
        </div>
      </div>
      {isToastOpen && toastName === "successToast" && (
        <RootToast toastName="successToast" />
      )}
      {isToastOpen && toastName === "errorToast" && (
        <RootToast toastName="errorToast" />
      )}
    </>
  );
};

export default TeamBuilding;
