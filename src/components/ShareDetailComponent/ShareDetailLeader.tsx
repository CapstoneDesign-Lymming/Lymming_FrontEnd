import { useLocation } from "react-router-dom";
import useModalStore from "../../store/useModalState";
import { useState } from "react";
import Header from "../header/Header";
import "./ShareDetailLeader.scss";
import RootModal from "../Modal/RootModal/RootModal";
import nouserImage from "../../assets/img/noimage.jpg";
import { useInfoStore } from "../../store/useLoginStore";

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
  const [formData, setFormData] = useState<ShareDetailLeaderProps>(initialData);
  const [projectLink, setProjectLink] = useState("");
  const [image, setImage] = useState<string | null>(null); // 이미지 URL을 저장할 상태
  const { setData } = useInfoStore();
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
  /** 이미지 업로드 */
  // const uploadProjectImg = () => {
  //   openModal();
  //   console.log(isModalOpen);
  // };

  // TODO: 1. 프론트에서 s3로 직접 이미지 업로드
  //2.이미지 링크 받아와서 str로 백엔드에게 전달
  /** 멤버 초대 모달 열기 */
  const invalidateInstance = () => {
    setModalName("shareInviteModal");
    openModal();
    console.log(isModalOpen);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file); // 선택한 파일의 URL 생성
      setImage(imageUrl); // 이미지 상태 업데이트
      setData({ userImg: imageUrl });
    }
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
            <img className="Addimage_box" src={image || nouserImage} />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload"
              onChange={handleImageChange}
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
            <div className="saveBtn">저장하기</div>
          </div>
        </div>
        {isModalOpen && modalName === "shareInviteModal" && (
          <RootModal modalName="shareInviteModal" />
        )}
      </div>
    </>
  );
};

export default ShareDetailLeader;
