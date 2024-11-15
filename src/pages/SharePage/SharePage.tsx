import axios from "axios";
import { useQuery } from "react-query";
import Header from "../../components/header/Header";
import "./SharePage.scss";
import { useNavigate } from "react-router-dom";
import { useInfoStore } from "../../store/useLoginStore";

interface ItemType {
  sharePageId: number;
  userId: number;
  projectId: number;
  sharePageDescription: string | null;
  teamMember: string | null;
  sharePageName: string | null;
  projectLink: string | null;
  sharePageUrl: string | null;
  teamName: string | null;
  end: boolean | null;
  leader: string;
}

const fetchLocalData = async () => {
  const response = await axios.get("https://lymming-back.link/share/list");
  console.log("sharepage 프로젝트 data", response.data);
  return response.data;
};

const SharePage = () => {
  const navigate = useNavigate();
  const nickname = useInfoStore((state) => state.data.nickname); // nickname 가져오기
  const { data, error, isLoading } = useQuery("localData", fetchLocalData);

  if (isLoading) return <div>로딩 중!</div>;
  if (error) return <div>에러</div>;

  return (
    <>
      <Header />
      <div className="SharePageWrapper">
        <div className="SharePage">
          <div className="SharePage-BodyWrapper">
            <div className="SharePage-BodyWrapper-CardBundle">
              {data.map((item: ItemType) => {
                // teamMember가 null 또는 문자열인지 확인
                const isTeamMember = item.teamMember
                  ? item.teamMember.split(",").includes(nickname) // 문자열 분리 후 비교
                  : false;

                const isLeader = item.leader === nickname;

                if (isLeader || isTeamMember) {
                  return (
                    <div
                      className={`SharePage-BodyWrapper-CardBundle-CardWrapper 
                        ${item.end ? "completed" : ""}`}
                      key={item.projectId}
                      onClick={() => {
                        navigate(`/share/detail/${item.sharePageId}`, {
                          state: item,
                        });
                      }}
                    >
                      <div className="CardInsideWrapper">
                        <div className="CardHeader">
                          <div
                            className={`${
                              item.sharePageName
                                ? "CardHeader-Title"
                                : "CardHeader-emptyText"
                            }`}
                          >
                            {item.sharePageName ||
                              "아직 프로젝트 이름이 설정되지 않았습니다"}
                          </div>
                        </div>
                        <div className="CardBody">
                          <img
                            src={item.sharePageUrl || "placeholder.jpg"}
                            alt="프로젝트 이미지"
                          />
                        </div>
                        <div className="CardFooter">
                          <div className="CardFooter-Description">
                            <div className="word">
                              {item.sharePageDescription ||
                                "아직 프로젝트 설명이 설정되지 않았습니다"}
                            </div>
                          </div>
                          <div className="CardFooter-MembersWrapper">
                            <div className="memberItem">{item.leader}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SharePage;
