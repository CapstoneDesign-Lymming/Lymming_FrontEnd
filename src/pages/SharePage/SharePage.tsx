import axios from "axios";
import { useQuery } from "react-query";
import Header from "../../components/header/Header";
import "./SharePage.scss";
import { useNavigate } from "react-router-dom";

interface ItemType {
  sharePageId: number;
  userId: number;
  projectId: number;
  sharePageDescription: string | null;
  teamMember: number[] | null;
  sharePageName: string | null;
  projectLink: string | null;
  sharePageUrl: string | null;
  teamName: string | null;
  end: boolean | null;
  leader: string;
}

const fetchLocalData = async () => {
  const response = await axios.get("https://lymming-back.link/share/list");
  console.log("ddd", response.data);
  return response.data;
};

const SharePage = () => {
  const navigate = useNavigate();

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
              {data.map((item: ItemType) => (
                <div
                  className={`SharePage-BodyWrapper-CardBundle-CardWrapper 
                        ${item.end ? "completed" : ""}`}
                  key={item.projectId}
                  onClick={() => {
                    navigate(`/share/detail/${item.projectId}`, {
                      state: item,
                    });
                  }}
                >
                  <div className="CardInsideWrapper">
                    <div className="CardHeader">
                      <div className="CardHeader-Title">
                        {item.sharePageName || "프로젝트 이름 없음"}
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
                          {item.sharePageDescription || "설명 없음"}
                        </div>
                      </div>
                      <div className="CardFooter-MembersWrapper">
                        <div className="memberItem">{item.leader}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SharePage;
