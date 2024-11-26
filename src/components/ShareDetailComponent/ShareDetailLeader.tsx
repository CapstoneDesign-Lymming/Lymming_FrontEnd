import { useLocation, useNavigate } from "react-router-dom";
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
import defalutImg from "../../assets/img/noimage.jpg";

interface ShareDetailLeaderProps {
  sharePageId: number;
  userId: number;
  projectId: number;
  projectLink: string;
  sharePageName: string;
  sharePageUrl: string;
  sharePageDescription: string;
  teamMember: string;
  memberUrlBundle: string; // 멤버의 이미지 번들
  positionBundle: string; //멤버의 포지션 번들
  teamName: string;
  leader: string;
  end: boolean;
}

const ShareDetailLeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const initialData: ShareDetailLeaderProps = location.state;
  const { isModalOpen, openModal } = useModalStore();
  const { setPosetSharePageId } = useModalStore();
  const [modalName, setModalName] = useState("");
  const { isToastOpen, openToast } = useToastStore();
  const [toastName, setToastName] = useState("");
  const [formData, setFormData] = useState<ShareDetailLeaderProps>({
    sharePageId: 0,
    userId: 0,
    projectId: 0,
    projectLink: "",
    sharePageName: "",
    sharePageUrl: "",
    sharePageDescription: "",
    teamMember: "",
    memberUrlBundle: "",
    positionBundle: "",
    teamName: "",
    leader: "",
    end: false,
  });
  const { imageUrl, handleFileChange, handleUpload } = useImageUpload();
  const teamMemberArr = formData.teamMember.split(",");
  console.log(typeof teamMemberArr, teamMemberArr);
  const teamMemberLen = teamMemberArr.length; //멤버 수
  console.log(teamMemberLen);
  const urlBundle = formData.memberUrlBundle?.split(",");
  console.log("formData.teamUrlBundle", formData.memberUrlBundle);

  console.log("urlBundle", urlBundle);
  const positionBundle = formData.positionBundle?.split(",");
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

  const invalidateInstance = (sharePageId: number) => {
    setPosetSharePageId(sharePageId);
    setModalName("shareInviteModal");
    openModal();
    console.log(isModalOpen);
  };

  const postS3ImageUrl = async () => {
    const s3ImageUrl = await handleUpload();
    console.log("postS3ImageUrl = ", s3ImageUrl);
    // setPutS3Img (s3ImageUrl);
    return s3ImageUrl;
  };

  const putShareDetail = async (s3ImgUrl: string = formData.sharePageUrl) => {
    console.log("put에서 ", s3ImgUrl);
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_ENDPOINT}/share/details/${
        formData.sharePageId
      }/leader`,
      {
        userId: formData.userId,
        projectId: formData.projectId,
        sharePageUrl: s3ImgUrl || formData.sharePageUrl, //s3경로는 직접 기입
        sharePageName: formData.sharePageName,
        sharePageDescription: formData.sharePageDescription,
        teamMember: formData.teamMember,
        teamName: formData.teamName,
        projectLink: formData.projectLink,
      }
    );
    setFormData(res.data);
  };
  //FIXME: postS3ImageUrl실행하지 않을 경우에 사진이 이전 데이터로 가지만, 파일을 업로드 해주세요라는 메시지 뜸 해결하기
  const saveShareDetail = async () => {
    const s3ImageUrl = await postS3ImageUrl();
    if (s3ImageUrl) {
      console.log("s3ImageUrl 존재, putShareDetail실행");
      putShareDetail(s3ImageUrl);
    } else {
      putShareDetail();
    }
    setToastName("successToast");
    openToast();
    // TODO: 완료하고 창 이전 페이지로 이동
    navigate("/share");
    //이후 수정하기 post하기
    // postUplodFileUrl(s3ImageUrl);
  };
  useEffect(() => {
    // location.state의 구조가 ShareDetailLeaderProps와 다르므로 변환
    const transformedData: ShareDetailLeaderProps = {
      sharePageId: location.state.sharePageId || 0,
      userId: location.state.userId || 0,
      projectId: location.state.projectId || 0,
      projectLink: location.state.projectLink || "",
      sharePageName: location.state.sharePageName || "", // 예시로 기본값 설정
      sharePageUrl: location.state.sharePageUrl || "",
      sharePageDescription: location.state.sharePageDescription || "",
      teamMember: location.state.teamMember || "",
      memberUrlBundle: location.state.memberUrlBundle || "", // 팀 멤버 URL 배열로 설정
      positionBundle: location.state.positionBundle || "", // 팀 멤버 직위 배열로 설정
      teamName: location.state.teamName || "",
      leader: location.state.leader || "",
      end: location.state.end || false, // 기본값 설정
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
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="projectNameWrapper">
                <div className="nameText">프로젝트 이름</div>
                <input
                  className="nameInput"
                  name="sharePageName"
                  value={formData.sharePageName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="InputBox_linkBundle">
              <div>프로젝트 링크</div>
              <input
                className="InputBox_linkBundle-inputBox"
                name="projectLink"
                value={formData.projectLink}
                onChange={handleInputChange}
              />
            </div>
            <div className="InputBox_descriptionBuncle">
              <div>프로젝트 설명</div>
              <textarea
                name="sharePageDescription"
                value={formData.sharePageDescription}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="ShareDetailLeader-AddImage_Bundle">
            <div className="Addimage_title">프로젝트 사진</div>
            <img
              className="Addimage_box"
              src={imageUrl || formData.sharePageUrl || defalutImg}
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
              {teamMemberArr?.map((name, idx) => (
                <div className="memberCard_Wrapper" key={idx}>
                  <div className="memberCard_Wrapper-imgWrapper">
                    {urlBundle && (
                      <img
                        src={urlBundle[idx] || nouserImage}
                        alt="team member"
                      />
                    )}{" "}
                  </div>
                  <div className="memberCard_Wrapper-memberInfoWrapper">
                    <div>{name}</div>
                    {positionBundle && <div>{positionBundle[idx]}</div>}
                  </div>
                </div>
              ))}
              {teamMemberLen < 5 && (
                <div
                  className="AddMember"
                  onClick={() => invalidateInstance(formData.sharePageId)}
                >
                  멤버 초대하기
                </div>
              )}
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
