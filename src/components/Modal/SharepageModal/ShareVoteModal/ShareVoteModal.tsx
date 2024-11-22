import { useInvoteStore } from "../../../../store/useInvoteStore";
import "./ShareVoteModal.scss";
const ShareVoteModal = () => {
  const { candidates, candidatesUrl, candidatesPosition } = useInvoteStore();
  const memberLength = candidates.length;
  const memberCnt = [];
  for (let i = 0; i < memberLength; i++) {
    memberCnt.push(i);
  }
  console.log("modal candidatesUrl", candidatesUrl);
  console.log("modal candidatesPosition", candidatesPosition);
  const clickVote = (nickname: string) => {
    console.log(nickname);
  };
  return (
    <div className="ShareVoteModal">
      {memberCnt &&
        memberCnt.map((idx, key) => (
          <div className="VoteCard" key={key}>
            <div>{candidates[idx]}</div>
            <img className="voteModalImg" src={candidatesUrl[idx]}></img>
            <div>{candidatesPosition[idx]}</div>
            <div onClick={() => clickVote(candidates[idx])}>투표하기!</div>
          </div>
        ))}
    </div>
  );
};

export default ShareVoteModal;
