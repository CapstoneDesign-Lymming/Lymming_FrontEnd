import useModalClose from "../../../hooks/useModalClose";
import useMemberProjectStore from "../../../store/useMemberProjectStore";
import "./MemberPageModal.scss";
const MemberPageModal = () => {
  const { modalRef } = useModalClose();
  const { nickname, projectNames, deadlines } = useMemberProjectStore();
  console.log(nickname);
  const projectLen = projectNames.length;

  const isDateBeforeToday = (dateString: string) => {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate < today;
  };

  const isEndArr: boolean[] = [];
  for (let i = 0; i < projectLen; i++) {
    isEndArr.push(isDateBeforeToday(deadlines[i]));
  }
  console.log("isEndArr", isEndArr[0]);
  return (
    <div ref={modalRef} className="MemberPage">
      <div className="MemberPage-title">{nickname}님이 작성한 포스트</div>
      <div className="MemberPage-body">
        {projectNames.map((item, idx) => (
          <div className="article" key={idx}>
            <div className="name" key={idx}>
              {item}
            </div>
            <div className={`state ${isEndArr[idx] === false ? "" : "end"}`}>
              {isEndArr[idx] === false ? "모집완료" : "모집중"}
            </div>
          </div>
        ))}

        {/* <div className="article">
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
        </div> */}
      </div>
    </div>
  );
};

export default MemberPageModal;
