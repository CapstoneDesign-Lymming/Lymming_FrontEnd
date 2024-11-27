import axios from "axios";
import useModalClose from "../../../../hooks/useModalClose";
import "./ShareInviteModal.scss";
import { useState } from "react";
import useModalStore from "../../../../store/useModalState";
import { useNavigate } from "react-router-dom";
const ShareInviteModal = () => {
  const [inviteNickName, setInviteNickName] = useState("");
  const { modalRef } = useModalClose();
  const { postSharePageId } = useModalStore();
  const navigate = useNavigate();

  const handleNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteNickName(e.target.value);
  };

  const inviteMember = async () => {
    try {
      console.log("inviteNickName", inviteNickName);
      const encodedName = encodeURIComponent(inviteNickName);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_ENDPOINT
        }/share/find/${encodedName}/${postSharePageId}`
      );

      navigate("/chat", {
        state: {
          id: response.data.nickname,
          invite: true,
          sharepage: response.data.sharePageId,
        },
      });

      return response.data;
    } catch (error) {
      alert("사용자가 없습니다!");
      console.error(error);
    }
  };

  return (
    <div ref={modalRef} className="ShareInviteModal">
      {/* <div className="ShareInviteModal-header"></div> */}
      <input
        className="ShareInviteModal-body"
        type="text"
        onChange={handleNickName}
        value={inviteNickName}
      />
      <div className="ShareInviteModal-footer" onClick={inviteMember}>
        초대하기
      </div>
    </div>
  );
};

export default ShareInviteModal;
