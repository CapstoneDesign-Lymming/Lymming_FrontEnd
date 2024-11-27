import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Participate.scss";
import Header from "../../components/header/Header";
import ParticipateBoard from "../../components/ParticipateBoard/ParticipateBoard";
import Usermodal from "../../components/Modal/UserModal/UserModal";
import skill_data from "../../data/skills.json";
import { ParticipateItem } from "../../interfaces/participate";
import { useInfoStore, useLoginStore } from "../../store/useLoginStore";

const Participate = () => {
  const inside = useRef<HTMLDivElement>(null);
  const { login } = useLoginStore();
  const { data: userData } = useInfoStore();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectTab, setSelectTab] = useState("전체");
  const [data, setData] = useState<ParticipateItem[]>([]);
  const [filterData, setFilterData] = useState<ParticipateItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectSecondTab, setSelectSecondTab] = useState({
    position: "",
    method: "",
  });
  const [userModalData, setUserModalData] = useState({
    userId: 0,
    nickname: "",
  });

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

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target;
    const selectedValue = target.value;

    setSelectSecondTab((prev) => ({
      ...prev, // 이전 상태를 복사
      [target.name]: selectedValue, // 선택된 키의 값을 업데이트
    }));
  };

  useEffect(() => {
    let filteredData: ParticipateItem[] = [...data];

    if (selectTab !== "전체") {
      filteredData = filteredData.filter((it) => it.studyType === selectTab);
    }

    if (selectedSkills.length > 0) {
      filteredData = filteredData.filter((it) => {
        // techStack이 배열인지 확인하고, 배열일 때만 .some 메서드를 사용

        return it.techStack
          .split(",")
          .some((skill) => selectedSkills.includes(skill));
      });
    }

    // 포지션 필터링
    if (selectSecondTab.position) {
      filteredData = filteredData.filter((it) => {
        return it.recruitmentField.includes(selectSecondTab.position);
      });
    }

    // 진행 방식 필터링
    if (selectSecondTab.method) {
      filteredData = filteredData.filter((it) => {
        return it.studyMethod.includes(selectSecondTab.method);
      });
    }
    setFilterData(filteredData as ParticipateItem[]);
    //setData(filteredData as ParticipateItem[]);
  }, [selectTab, selectedSkills, selectSecondTab]);

  const handleClickOutside = (e: MouseEvent) => {
    if (inside.current && !inside.current.contains(e.target as Node)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (login) {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_ENDPOINT}/participate/${
              userData.userId
            }`
          );
          const reverseData = res.data.reverse(); //데이터를 최신순으로 정렬
          setData(reverseData as ParticipateItem[]);
          setFilterData(reverseData as ParticipateItem[]);
        } else {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_ENDPOINT}/participate`
          );
          const reverseData = res.data.reverse(); //데이터를 최신순으로 정렬
          setData(reverseData as ParticipateItem[]);
          setFilterData(reverseData as ParticipateItem[]);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getData();
  }, []);
  //서버에서 리스트 받아오는 걸로 수정해야함

  return (
    <div className="Participate">
      <Header />

      {userModalOpen && (
        <>
          <div className="backdrop" onClick={() => setUserModalOpen(false)} />
          <Usermodal
            close={setUserModalOpen}
            userId={userModalData.userId}
            nickname={userModalData.nickname}
          />
        </>
      )}
      {visible && (
        <div className="skillSelector" ref={inside}>
          <button onClick={() => setVisible(false)}>닫기</button>

          <div className="skill-item">
            {skill_data.skills.map((item, index) => (
              <React.Fragment key={index}>
                <input
                  type="checkbox"
                  id={item.name}
                  value={item.name}
                  onChange={onSkillClick}
                  checked={selectedSkills.includes(item.name)}
                />
                <div key={item.name} className="wrapper">
                  <img src={item.url} />

                  <label htmlFor={item.name} className={"skill_name"}>
                    {item.name}
                  </label>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="menu">
        <div className="menu-tap">
          <span
            className={selectTab === "전체" ? "active" : ""}
            onClick={() => setSelectTab("전체")}
          >
            전체
          </span>
          <span
            className={selectTab === "프로젝트" ? "active" : ""}
            onClick={() => setSelectTab("프로젝트")}
          >
            프로젝트
          </span>
          <span
            className={selectTab === "스터디" ? "active" : ""}
            onClick={() => setSelectTab("스터디")}
          >
            스터디
          </span>
        </div>
        <div className="menu-filter">
          <span id="technology-stack" onClick={() => setVisible(!visible)}>
            기술스택
          </span>

          <div>
            <select
              id="position"
              name="position"
              onChange={onSelectChange}
              defaultValue=""
            >
              <option value="" disabled hidden>
                포지션
              </option>
              <option value="">전체</option>
              <option value="프론트">프론트</option>
              <option value="백엔드">백엔드</option>
              <option value="디자이너">디자이너</option>
              <option value="기획">기획</option>
            </select>
          </div>

          <div>
            <select
              id="method"
              name="method"
              onChange={onSelectChange}
              defaultValue=""
            >
              <option value="" disabled hidden>
                진행방식
              </option>
              <option value="">전체</option>
              <option value="온라인">온라인</option>
              <option value="오프라인">오프라인</option>
            </select>
          </div>
        </div>
      </div>

      <div className="content">
        {filterData.map((it, index) => {
          // 인덱스 프롭 임시 설정 나중에는 게시물 아이디로 할거임
          return (
            <ParticipateBoard
              item={it}
              key={index}
              index={index}
              setUserModalData={setUserModalData}
              setUserModalOpen={setUserModalOpen}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Participate;
