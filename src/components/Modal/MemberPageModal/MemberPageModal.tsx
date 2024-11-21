import useModalClose from "../../../hooks/useModalClose";
import "./MemberPageModal.scss";
const MemberPageModal = () => {
  const { modalRef } = useModalClose();

  return (
    <div ref={modalRef} className="MemberPage">
      <div className="MemberPage-title">기훈님이 작성한 포스트</div>
      <div className="MemberPage-body">
        <div className="article">
          <div className="name">리밍</div>
          <div className="state">모집중</div>
        </div>
        <div className="article">
          <div className="name">
            리밍리밍리밍리밍리밍리밍리밍리밍리밍ddddddddddd리밍
          </div>
          <div className="state">모집중</div>
        </div>
        <div className="article">
          <div className="name">리밍</div>
          <div className="state end">모집완료</div>
        </div>
        <div className="article">
          <div className="name">리밍</div>
          <div className="state end">모집완료</div>
        </div>
        <div className="article">
          <div className="name">리밍</div>
          <div className="state">모집중</div>
        </div>
      </div>
    </div>
  );
};

export default MemberPageModal;
