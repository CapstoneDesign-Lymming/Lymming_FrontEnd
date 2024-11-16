import useModalClose from "../../../hooks/useModalClose";
import "./MemberPageModal.scss";
const MemberPageModal = () => {
  const { modalRef } = useModalClose();
  return (
    <div ref={modalRef} className="MemberPageModalWrapper">
      <div></div>
      <div>dddd</div>
      <div></div>
      <div></div>
    </div>
  );
};

export default MemberPageModal;
