import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/header/Header";
import "./TeamBuilding.scss";
import imgs from "../../assets/img/noimage.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import skills from "../../data/skills.json";
import useImageUpload from "../../hooks/useImageUpload";
import { useInfoStore } from "../../store/useLoginStore";

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
  // const [img, setImg] = useState<File | null>(null);
  const imgRef = useRef<HTMLInputElement | null>(null);

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
  const { imageUrl, handleFileChange, handleUpload, postUplodFileUrl } =
    useImageUpload();

  const onBtnClick = () => {
    if (imgRef.current) {
      imgRef.current.click();
    }
  };
  // const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const target = e.target;
  //   const file = target.files;

  //   if (file) {
  //     setImg(file[0]);
  //     setState({ ...state, img: file[0] });
  //     console.log(target.name);
  //     console.log(state);
  //   }
  // };

  const onChange = (e: any) => {
    const target = e.target;
    if (target) {
      const value =
        target.name === "recruitmentCount"
          ? parseInt(target.value, 10)
          : target.value;
      setState({ ...state, [target.name]: value });
    }
  };

  const onSkillsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setState({ ...state, techStack: selectedOptions.join(", ") });
  };

  const onsubmit = async () => {
    const requiredFields = [
      { field: "studyType", message: "모집 구분을 선택하세요." },
      { field: "recruitmentCount", message: "모집 인원을 입력하세요." },
      { field: "studyMethod", message: "진행 방식을 선택하세요." },
      { field: "projectDuration", message: "기간을 선택하세요." },
      { field: "deadline", message: "마감 날짜를 선택하세요." },
      { field: "recruitmentField", message: "포지션을 입력하세요." },
      { field: "workType", message: "스타일을 선택하세요." },
      { field: "projectName", message: "제목을 입력하세요." },
      { field: "projectImg", message: "이미지를 첨부하세요." },
      { field: "description", message: "내용을 입력하세요." },
      { field: "techStack", message: "기술을 입력하세요." },
    ];

    for (const { field, message } of requiredFields) {
      if (!state[field as keyof State]) {
        window.alert(message);
        break;
      }
    }

    await uploadImage();

    // if (img) {
    //   console.log("이미지 파일이 존재합니다:", img);
    //   formData.append("projectImg", img);
    // } else {
    //   console.log("이미지 없음");
    // }

    // 서버 전송 로직 짜기

    try {
      const res = await axios.post("https://lymming-back.link/teambuild", {
        userId: data.userId,
        state,
        uploadTime: new Date().toISOString().substring(0, 10),
      });
      console.log(res);
      //navigate("/participate");
    } catch (e) {
      console.error(e);
    }
  };

  const uploadImage = async () => {
    const s3ImageUrl = await handleUpload();
    if (s3ImageUrl) {
      console.log(state.projectImg, "state에 이미지 추가");
      postUplodFileUrl(s3ImageUrl);
    } else {
      console.error("Image upload failed; URL is undefined");
    }
  };
  // const imgPreviewUrl = imgs ? imageUrl : imgs;

  useEffect(() => {
    setState({ ...state, projectImg: imageUrl! });
  }, [imageUrl]);

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
                    value="project"
                  />
                  <label htmlFor="project">프로젝트</label>
                </div>
                <div className="content-top-left-body-box">
                  <input
                    type="radio"
                    name="studyType"
                    id="study"
                    onChange={onChange}
                    value="study"
                  />
                  <label htmlFor="study">스터디</label>
                </div>
              </div>
            </div>
            <div className="content-top-right">
              <div className="content-top-right-1">
                <span>모집 인원</span>
                <select onChange={onChange} name="recruitmentCount">
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
                <select onChange={onChange} name="studyMethod">
                  <option value="" disabled hidden>
                    선택하세요
                  </option>
                  <option value="">선택</option>
                  <option value="online">온라인</option>
                  <option value="offline">오프라인</option>
                  <option value="mix">혼합</option>
                </select>
              </div>
            </div>
          </div>

          <div className="content-center">
            <div className="content-center-left">
              <span>프로젝트 기간</span>
              <select onChange={onChange} name="projectDuration">
                <option value="">선택</option>
                <option value="less_than_1_month">1달 이하</option>
                <option value="1_month">1달</option>
                <option value="3_months">3개월</option>
                <option value="6_months">6개월</option>
                <option value="more_than_1_year">1년 이상</option>
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
                <option value="front">프론트</option>
                <option value="back">벡</option>
                <option value="ai">ai</option>
                <option value="game">게임</option>
                <option value="design">디자이너</option>
                <option value="plan">기획</option>
                <option value="etc">기타</option>
              </select>
            </div>

            <div className="content-center-right">
              <span>원하는 개발 스타일</span>
              <select onChange={onChange} name="workType">
                <option value="">선택</option>
                <option value="enthusiastic">열정적</option>
                <option value="independent">독립적</option>
                <option value="diligent">성실</option>
              </select>
            </div>
            <div className="content-center-middle">
              <span>모집 스킬</span>
              <select onChange={onSkillsChange} name="techStack" multiple>
                <option value="">선택</option>
                {skills.skills.map((it, index) => {
                  return (
                    <option value={it.name} key={index}>
                      {it.name}
                    </option>
                  );
                })}
              </select>
            </div>
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
            <button className="submit" onClick={onsubmit}>
              등록
            </button>
            <button className="cancel" onClick={() => navigate("/participate")}>
              취소
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamBuilding;
