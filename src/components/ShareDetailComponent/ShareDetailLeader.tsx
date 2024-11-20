import { useLocation } from "react-router-dom";
import useModalStore from "../../store/useModalState";
import { useEffect, useState } from "react";
import Header from "../header/Header";
import "./ShareDetailLeader.scss";
import RootModal from "../Modal/RootModal/RootModal";
import nouserImage from "../../assets/img/noimage.jpg";
import useImageUpload from "../../hooks/useImageUpload";
import { useToastStore } from "../../store/useToastState";
import RootToast from "../Toast/RootToast/RootToast";
import axios from "axios";

interface ShareDetailLeaderProps {
  userId: number;
  project_id: number;
  sharePageId: number;
  project_name: string;
  sharepage_url: string;
  project_description: string;
  team_member: number[];
  team_member_name: string[];
  team_member_url: string[];
  team_member_position: string[];
  team_leader: string;
  team_name: string;
  is_completed: boolean;
  project_link: string;
}

const ShareDetailLeader = () => {
  const location = useLocation();
  // const initialData: ShareDetailLeaderProps = location.state;
  const { isModalOpen, openModal } = useModalStore();
  const [modalName, setModalName] = useState("");
  const { isToastOpen, openToast } = useToastStore();
  const [toastName, setToastName] = useState("");
  const [formData, setFormData] = useState<ShareDetailLeaderProps>({
    userId: 0,
    project_id: 0,
    sharePageId: 0,
    project_name: "",
    sharepage_url: "",
    project_description: "",
    team_member: [],
    team_member_name: [],
    team_member_url: [],
    team_member_position: [],
    team_leader: "",
    team_name: "",
    is_completed: false,
    project_link: "",
  });
  // const [projectLink, setProjectLink] = useState("");
  const { imageUrl, handleFileChange, handleUpload } = useImageUpload();

  // console.log("initialData", initialData);
  // console.log("formData", formData);

  /** 입력 값 변경 핸들러 */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleProjectLink = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   setProjectLink(e.target.value);
  // };

  const invalidateInstance = () => {
    setModalName("shareInviteModal ");
    openModal();
    console.log(isModalOpen);
  };

  const postS3ImageUrl = async () => {
    const s3ImageUrl = await handleUpload();
    console.log("postS3ImageUrl = ", s3ImageUrl);
    // setPutS3Img (s3ImageUrl);
    return s3ImageUrl;
  };

  const putShareDetail = async (s3ImgUrl: string) => {
    const postTeam = formData.team_member.join(",");
    console.log("put에서 ", s3ImgUrl);
    const res = await axios.put(
      `https://lymming-back.link/share/details/${formData.sharePageId}/leader`,
      {
        userId: formData.userId,
        projectId: formData.project_id,
        sharePageUrl: s3ImgUrl, //s3경로는 직접 기입
        sharePageName: formData.project_name,
        sharePageDescription: formData.project_description,
        teamMember: postTeam,
        teamName: formData.team_name,
        projectLink: formData.project_link,
      }
    );
    setFormData(res.data);
  };

  const saveShareDetail = async () => {
    const s3ImageUrl = await postS3ImageUrl();
    if (s3ImageUrl) {
      console.log("s3ImageUrl 존재, putShareDetail실행");
      putShareDetail(s3ImageUrl);
    }
    setToastName("successToast");
    openToast();
    //이후 수정하기 post하기
    // postUplodFileUrl(s3ImageUrl);
  };
  useEffect(() => {
    // location.state의 구조가 ShareDetailLeaderProps와 다르므로 변환
    const transformedData: ShareDetailLeaderProps = {
      userId: location.state.userId,
      project_id: location.state.projectId,
      sharePageId: location.state.sharePageId,
      project_name: location.state.sharePageName || "", // 예시로 기본값 설정
      sharepage_url: location.state.sharePageUrl || "",
      project_description: location.state.sharePageDescription || "",
      team_member: Array.isArray(location.state.teamMember)
        ? location.state.teamMember
        : [location.state.teamMember], // teamMember가 배열이 아니면 배열로 감싸기
      team_member_name: [location.state.teamMemberName || ""], // 팀 멤버 이름 배열로 설정
      team_member_url: [location.state.teamMemberUrl || ""], // 팀 멤버 URL 배열로 설정
      team_member_position: [location.state.teamMemberPosition || ""], // 팀 멤버 직위 배열로 설정
      team_leader: location.state.leader || "",
      team_name: location.state.teamName || "",
      is_completed: location.state.isCompleted || false, // 기본값 설정
      project_link: location.state.projectLink || "",
    };
    setFormData(transformedData);
    console.log("useEffect", transformedData); // 변환된 데이터 확인
  }, [location.state]); // location.state가 변경될 때마다 실행

  return (
    <>
      <Header />
      <div className="ShareDetailLeaderWrapper">
        <div className="ShareDetailLeader">
          <div className="ShareDetailLeader-InputBox_Bunddle">
            <div className="InputBox_NameBundle">
              <div className="teamNameWrapper">
                <div className="nameText">팀 이름</div>
                <input
                  className="nameInput"
                  name="team_name"
                  value={formData.team_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="projectNameWrapper">
                <div className="nameText">프로젝트 이름</div>
                <input
                  className="nameInput"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="InputBox_linkBundle">
              <div>프로젝트 링크</div>
              <input
                className="InputBox_linkBundle-inputBox"
                name="project_link"
                value={formData.project_link}
                onChange={handleInputChange}
              />
            </div>
            <div className="InputBox_descriptionBuncle">
              <div>프로젝트 설명</div>
              <textarea
                name="project_description"
                value={formData.project_description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="ShareDetailLeader-AddImage_Bundle">
            <div className="Addimage_title">프로젝트 사진</div>
            <img
              className="Addimage_box"
              src={imageUrl || formData.sharepage_url || nouserImage}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload"
              onChange={handleFileChange}
            ></input>
            <div
              className="upload_btn"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              이미지 업로드
            </div>
          </div>
          <div className="ShareDetailLeader-Members_Bundle">
            <div>참여 인원</div>
            <div className="memberCard_Wrapper_Root">
              {formData.team_member?.map((id, idx) => (
                <div className="memberCard_Wrapper" key={id}>
                  <div className="memberCard_Wrapper-imgWrapper">
                    <img
                      src={formData.team_member_url[idx]}
                      alt="team member"
                    />
                  </div>
                  <div className="memberCard_Wrapper-memberInfoWrapper">
                    <div>{formData.team_member_name[idx]}</div>
                    <div>{formData.team_member_position[idx]}</div>
                  </div>
                </div>
              ))}
              <div className="AddMember" onClick={invalidateInstance}>
                멤버 초대하기
              </div>
            </div>
          </div>
          <div className="ShareDetailLeader-Footer_BtnWrapper">
            <div className="saveBtn" onClick={saveShareDetail}>
              저장하기
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && modalName === "shareInviteModal" && (
        <RootModal modalName="shareInviteModal" />
      )}
      {isToastOpen && toastName === "successToast" && (
        <RootToast toastName="successToast" />
      )}
    </>
  );
};

export default ShareDetailLeader;
