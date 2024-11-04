import Header from "../../components/header/Header";
import "./Participate.scss";
import dummy from "../../data/participateDummyData.json";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Usermodal from "../../components/Modal/UserModal/UserModal";
import skill_data from "../../data/skills.json";
import newImg from "../../assets/img/new.png";
import watch from "../../assets/img/watch.png";
import chat from "../../assets/img/chat.png";
import heart from "../../assets/img/heart.png";

interface ParticipateItem {
  type: string;
  title: string;
  end: string;
  position: string[];
  style: string[];
  userId: string;
  skill: string[];
  skillicon: string[];
}

const Participate = () => {
  const navigate = useNavigate();
  const inside = useRef<HTMLDivElement>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectTab, setSelectTab] = useState("전체");
  const [data, setData] = useState<ParticipateItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectSecondTab, setSelectSecondTab] = useState({
    position: "",
    method: "",
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
    let filteredData =
      selectTab === "전체"
        ? dummy.dummy
        : dummy.dummy.filter((it) => it.type === selectTab);

    if (selectedSkills.length > 0) {
      filteredData = filteredData.filter((it) => {
        return it.skill.some((skill) => selectedSkills.includes(skill));
      });
    }

    console.log(selectSecondTab);

    // 포지션 필터링
    if (selectSecondTab.position) {
      filteredData = filteredData.filter((it) => {
        return it.position.includes(selectSecondTab.position);
      });
    }

    // 진행 방식 필터링
    if (selectSecondTab.method) {
      filteredData = filteredData.filter((it) => {
        return it.method.includes(selectSecondTab.method);
      });
    }

    setData(filteredData);
  }, [selectTab, selectedSkills, selectSecondTab]);

  const handleClickOutside = (e: MouseEvent) => {
    console.log("click");
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
  //서버에서 리스트 받아오는 걸로 수정해야함

  return (
    <div className="Participate">
      <Header />

      {userModalOpen && (
        <>
          <div className="backdrop" onClick={() => setUserModalOpen(false)} />
          <Usermodal close={setUserModalOpen} />
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
              <option value="method" disabled hidden>
                진행방식
              </option>
              <option value="온라인">온라인</option>
              <option value="오프라인">오프라인</option>
            </select>
          </div>
        </div>
      </div>

      <div className="content">
        {data.map((it, index) => {
          return (
            <div className="content-item" key={index}>
              <div
                className="content-item-top"
                onClick={() =>
                  navigate(`/participate/detail/${index}`, { state: it })
                }
              >
                <div className="content-item-top-label">
                  <div className="content-item-top-label-left">{it.type}</div>
                  <div className="content-item-top-label-right">
                    <img src={newImg} />
                    <span>D-20</span>
                  </div>
                </div>
                <div className="content-item-top-title">{it.title}</div>
                <div className="content-item-top-info">
                  <span>마감</span> <span>|</span> <span>{it.end}</span>
                </div>
                <div className="content-item-top-feature">
                  {it.position.map((it, index) => {
                    return <span key={index}>{it}</span>;
                  })}
                </div>
                <div className="content-item-top-style">
                  {it.style.map((it, index) => {
                    return <span key={index}>{it}</span>;
                  })}
                </div>
                <div className="content-item-top-skills">
                  {it.skillicon.map((it, index) => {
                    return <img src={it} key={index} />;
                  })}
                </div>
                <hr />
              </div>
              <div className="content-item-bottom">
                <div
                  className="content-item-bottom-left"
                  onClick={() => setUserModalOpen(true)}
                >
                  <img />
                  <span>{it.userId}</span>
                </div>
                <div className="content-item-bottom-right">
                  <div className="content-item-bottom-right-watch">
                    <img src={watch} />
                    <span>10</span>
                  </div>
                  <div
                    className="content-item-bottom-right-chat"
                    onClick={() =>
                      navigate("/chat", { state: { id: it.userId } })
                    }
                  >
                    <img src={chat} />
                    <span>채팅하기</span>
                  </div>
                  <div className="content-item-bottom-right-heart">
                    <img src={heart} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Participate;
