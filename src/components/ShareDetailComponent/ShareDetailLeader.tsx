import { useLocation } from "react-router-dom";
import useModalStore from "../../store/useModalState";
import { useState } from "react";
import Header from "../header/Header";
import "./ShareDetailLeader.scss";
import RootModal from "../Modal/RootModal/RootModal";
import nouserImage from "../../assets/img/noimage.jpg";
import useImageUpload from "../../hooks/useImageUpload";
import { useToastStore } from "../../store/useToastState";
import RootToast from "../Toast/RootToast/RootToast";

interface ShareDetailLeaderProps {
  userId: number;
  project_id: number;
  project_name: string;
  project_url: string;
  project_description: string;
  team_member: number[];
  team_member_name: string[];
  team_member_url: string[];
  team_member_position: string[];
  team_leader: string;
  is_completed: boolean;
}

const ShareDetailLeader = () => {
  const location = useLocation();
  const initialData: ShareDetailLeaderProps = location.state;
  const { isModalOpen, openModal } = useModalStore();
  const [modalName, setModalName] = useState("");
  const { isToastOpen, openToast } = useToastStore();
  const [toastName, setToastName] = useState("");
  const [formData, setFormData] = useState<ShareDetailLeaderProps>(initialData);
  const [projectLink, setProjectLink] = useState("");
  const { imageUrl, handleFileChange, handleUpload, postUplodFileUrl } =
    useImageUpload();

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

  const handleProjectLink = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjectLink(e.target.value);
  };

  const invalidateInstance = () => {
    setModalName("shareInviteModal");
    openModal();
    console.log(isModalOpen);
  };

  const saveShareDetail = async () => {
    setToastName("successToast");
    openToast();
    const s3ImageUrl = await handleUpload();
    postUplodFileUrl(s3ImageUrl);
  };

  return (
    <>
      <Header />
      <div className="ShareDetailLeaderWrapper">
        <div className="ShareDetailLeader">
          <div className="ShareDetailLeader-InputBox_Bunddle">
            <div className="InputBox_NameBundle">
              {/* <div className="teamNameWrapper">
                <div className="nameText">팀 이름</div>
                <input
                  className="nameInput"
                  name="team_leader"
                  value={formData.team_leader}
                  onChange={handleInputChange}
                />  
              </div> */}
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
                name="project_url"
                value={projectLink}
                onChange={handleProjectLink}
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
            <img className="Addimage_box" src={imageUrl || nouserImage} />
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
                  <div>
                    <div>{formData.team_member_name[idx]}</div>
                    <div>{formData.team_member_position[idx]}</div>
                  </div>
                </div>
              ))}
              <div className="AddMember" onClick={invalidateInstance}>
                초대하기
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
