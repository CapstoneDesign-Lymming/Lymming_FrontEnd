import axios from "axios";
import { useQuery } from "react-query";
import Header from "../../components/header/Header";
import "./SharePage.scss";
import { useNavigate } from "react-router-dom";
import { useInfoStore } from "../../store/useLoginStore";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import defalutImg from "../../assets/img/noimage.jpg";
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
  end: string | null;
  leader: string;
  memberUrlBundle: string; // 멤버의 이미지 번들
  positionBundle: string;
}

const fetchShareData = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_ENDPOINT}/share/list`
  );
  const reverseData = response.data.reverse();

  return reverseData;
};

const SharePage = () => {
  const navigate = useNavigate();
  const nickname = useInfoStore((state) => state.data.nickname); // nickname 가져오기

  const { data, error, isLoading } = useQuery("localData", fetchShareData);
  if (isLoading) return <Loading />;
  if (error) return <Error />;

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
                  ? item.teamMember.split(",").includes(nickname) // 내 닉네임이 팀멤버에 속해 있는지 boolean으로 반환
                  : false;

                const isLeader = item.leader === nickname;
                const teamMemberArr = item.teamMember?.split(",");
                if (isLeader || isTeamMember) {
                  return (
                    <div
                      className={`SharePage-BodyWrapper-CardBundle-CardWrapper 
                        ${item.end === "TRUE" ? "completed" : ""}`}
                      key={item.projectId}
                      onClick={() => {
                        navigate(`/share/detail/${item.sharePageId}`, {
                          state: item,
                        });
                      }}
                    >
                      <div className="CardInsideWrapper">
                        <div
                          className={`CardHeader ${
                            item.end === "TRUE" ? "isEnd" : ""
                          }`}
                        >
                          <div
                            className={`${
                              item.sharePageName
                                ? "CardHeader-Title"
                                : "CardHeader-emptyText"
                            }`}
                          >
                            {item.sharePageName || "프로젝트 이름 미정"}
                          </div>
                        </div>
                        <div className="CardBody">
                          <img
                            src={
                              item.sharePageUrl ? item.sharePageUrl : defalutImg
                            }
                            alt="프로젝트 이미지"
                          />
                        </div>
                        <div className="CardFooter">
                          <div className="CardFooter-Description">
                            <div className="word">
                              {item.sharePageDescription || "설명 미기입"}
                            </div>
                          </div>

                          <div className="CardFooter-MembersWrapper">
                            {teamMemberArr?.map((name, index) => (
                              <div className="memberItem" key={index}>
                                {name}
                              </div>
                            ))}
                          </div>
                        </div>
                        {item.end === "TRUE" && (
                          <div className="endproject">
                            <svg
                              className="end_icon"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
                            </svg>
                            <div>종료됨</div>
                          </div>
                        )}
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
