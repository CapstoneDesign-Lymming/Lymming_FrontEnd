import Header from "../../components/header/Header";
import "./Participate.scss";
import dummy from "../../data/participateDummyData.json";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Usermodal from "../../components/Modal/UserModal/UserModal";
import skill_data from "../../data/skills.json";

interface ParticipateItem {
  type: string;
  title: string;
  end: string;
  position: string[];
  style: string[];
  name: string;
}

const Participate = () => {
  const navigate = useNavigate();
  const [userModalOpen, setUserModalOpen] = useState(false);

  const [selectTab, setSelectTab] = useState("전체");
  const [data, setData] = useState<ParticipateItem[]>([]);

  const [visible, setVisible] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

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
    const filteredData =
      selectTab === "전체"
        ? dummy.dummy
        : dummy.dummy.filter((it) => it.type === selectTab);

    // 선택된 기술 스택으로 추가 필터링 로직추가

    setData(filteredData);
  }, [selectTab]);

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
        <div className="skillSelector">
          <button onClick={() => setVisible(false)}>닫기</button>

          <div className="skill-item">
            {skill_data.skills.map((item) => (
              <div key={item.name} className="wrapper">
                <img src={item.url} />
                <input
                  type="checkbox"
                  id={item.name}
                  value={item.name}
                  onChange={onSkillClick}
                />
                <label htmlFor={item.name} className="skill_name">
                  {item.name}
                </label>
              </div>
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
            <select id="position">
              <option value="position" disabled hidden>
                포지션
              </option>
              <option value="developer">개발자</option>
              <option value="designer">디자이너</option>
            </select>
          </div>

          <div>
            <select id="method">
              <option value="method" disabled hidden>
                진행방식
              </option>
              <option value="agile">온라인</option>
              <option value="waterfall">오프라인</option>
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
                    <img />
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
                  <img />
                  <img />
                  <img />
                </div>
                <hr />
              </div>
              <div
                className="content-item-bottom"
                onClick={() => setUserModalOpen(true)}
              >
                <div className="content-item-bottom-left">
                  <img />
                  <span>{it.name}</span>
                </div>
                <div className="content-item-bottom-right">
                  <div className="content-item-bottom-right-watch">
                    <img />
                    <span>10</span>
                  </div>
                  <div className="content-item-bottom-right-chat">
                    <img />
                    <span>채팅하기</span>
                  </div>
                  <div className="content-item-bottom-right-heart">
                    <img />
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
