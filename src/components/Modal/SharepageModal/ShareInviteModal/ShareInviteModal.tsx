import axios from "axios";
import useModalClose from "../../../../hooks/useModalClose";
import "./ShareInviteModal.scss";
const ShareInviteModal = () => {
  const { modalRef } = useModalClose();
  /**멤버 초대하는 로직 */
  const inviteMember = () => {
    try {
      const response = axios.get("");
      return response;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div ref={modalRef} className="ShareInviteModal">
      {/* <div className="ShareInviteModal-header"></div> */}
      <input className="ShareInviteModal-body" type="text" />
      <div className="ShareInviteModal-footer" onClick={inviteMember}>
        초대하기
      </div>
    </div>
  );
};

export default ShareInviteModal;
