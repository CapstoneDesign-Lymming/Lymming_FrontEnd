import axios from "axios";
import useModalClose from "../../../../hooks/useModalClose";
import "./ShareInviteModal.scss";
import { useState } from "react";
const ShareInviteModal = () => {
  const { modalRef } = useModalClose();
  const [inviteNickName, setInviteNickName] = useState("");
  const handleNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteNickName(e.target.value);
  };

  const inviteMember = async () => {
    try {
      console.log("inviteNickName", inviteNickName);
      const response = await axios.get(
        `https://lymming-back.link/share/find/${inviteNickName}`
      );
      console.log("초대", response.data);
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
