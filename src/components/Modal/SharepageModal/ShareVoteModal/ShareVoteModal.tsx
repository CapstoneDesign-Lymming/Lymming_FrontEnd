import { useInvoteStore } from "../../../../store/useInvoteStore";
import "./ShareVoteModal.scss";
const ShareVoteModal = () => {
  const { candidates } = useInvoteStore();

  return (
    <div className="ShareVoteModal">
      {candidates && candidates.map((item, idx) => <div key={idx}>{item}</div>)}
    </div>
  );
};

export default ShareVoteModal;
