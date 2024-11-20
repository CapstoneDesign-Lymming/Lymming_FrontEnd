import useModalClose from "../../../hooks/useModalClose";
import "./MemberPageModal.scss";
const MemberPageModal = () => {
  const { modalRef } = useModalClose();

  return (
    <div ref={modalRef} className="MemberPage">
      <div className="MemberPage-title">기훈님이 작성한 포스트</div>
      <div className="MemberPage-body">
        <div className="article">
          <div className="name"></div>
          <div className="end"></div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default MemberPageModal;
