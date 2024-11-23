import { useState } from "react";
import { useInvoteStore } from "../../../../store/useInvoteStore";
import "./ShareVoteModal.scss";
import axios from "axios";
import useModalClose from "../../../../hooks/useModalClose";
const ShareVoteModal = () => {
  const [selectMember, setSelectMember] = useState("");
  const {
    candidates,
    candidatesUrl,
    candidatesPosition,
    nickname,
    sharePageId,
  } = useInvoteStore();

  const { closeModal } = useModalClose();

  const memberLength = candidates.length;
  const memberCnt = [];
  for (let i = 0; i < memberLength; i++) {
    memberCnt.push(i);
  }
  console.log("candidates", candidates);
  console.log("들어온 닉네임", nickname);
  const votePost = async (member: string) => {
    const res = await axios.post("https://lymming-back.link/vote/best/member", {
      nickname: nickname,
      bestMember: member,
      sharePageId: sharePageId,
    });
    if (res.status === 200) {
      console.log("투표완료");
      closeModal();
    }
  };

  const clickVote = () => {
    if (!selectMember) alert("팀원을 선택해주세요.");
    votePost(selectMember);
  };

  return (
    <div className="ShareVoteModal">
      <div className="title_1">프로젝트가 종료되었습니다</div>
      <div className="title_2">
        프로젝트 진행 중 가장 크게 기여했다고 생각하는 한 사람을 선택해 주세요.
      </div>
      <div className="VoteCardWrapper">
        {memberCnt &&
          memberCnt.map((i, key) => (
            <div className="VoteCard" key={key}>
              <img className="VoteCard-img" src={candidatesUrl[i]}></img>
              <div className="VoteCard-name">{candidates[i]}</div>
              <div className="VoteCard-position">{candidatesPosition[i]}</div>
              <div
                className={`VoteCard-btn ${
                  selectMember === candidates[i] ? "selected" : ""
                }`}
                onClick={() => setSelectMember(candidates[i])}
              >
                선택
              </div>
            </div>
          ))}
      </div>
      <div className="voteBtnWrapper">
        <div className="voteBtn" onClick={clickVote}>
          투표하기
        </div>
      </div>
    </div>
  );
};

export default ShareVoteModal;
