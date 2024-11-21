import axios from "axios";
import { useQuery } from "react-query";
import Header from "../../components/header/Header";
import "./SharePage.scss";
import { useNavigate } from "react-router-dom";
import { useInfoStore } from "../../store/useLoginStore";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

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
  memberUrlBundle: string; // 멤버의 이미지 번들
  positionBundle: string;
}

const fetchShareData = async () => {
  const response = await axios.get("https://lymming-back.link/share/list");

  console.log("sharepage 프로젝트 data", response.data);
  return response.data;
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
                        ${item.end ? "completed" : ""}`}
                      key={item.projectId}
                      onClick={() => {
                        navigate(`/share/detail/${item.sharePageId}`, {
                          state: item,
                        });
                      }}
                    >
                      <div className="CardInsideWrapper">
                        <div
                          className={`CardHeader ${item.end ? "isEnd" : ""}`}
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
                            src={item.sharePageUrl || "placeholder.jpg"}
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
                            {" "}
                            {teamMemberArr?.map((name, index) => (
                              <div className="memberItem" key={index}>
                                {name}
                              </div>
                            ))}
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
