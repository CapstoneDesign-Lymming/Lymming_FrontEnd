import useModalClose from "../../../hooks/useModalClose";
import "./MemberPageModal.scss";
const MemberPageModal = () => {
  const { modalRef } = useModalClose();

  return (
    <div ref={modalRef} className="MemberPageModalWrapper">
      <div>기훈님이 작성한 포스트</div>
      <div>dddd</div>
      <div></div>
      <div></div>
    </div>
  );
};

export default MemberPageModal;
