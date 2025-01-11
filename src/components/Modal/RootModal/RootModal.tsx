import { ModalPortal } from "../../../helper/Potal";
import HelpPinModal from "../HelpPinModal/HelpPinModal";
import MemberPageModal from "../MemberPageModal/MemberPageModal";
import ShareEndModal from "../SharepageModal/ShareEndModal/ShareEndModal";
import ShareInviteModal from "../SharepageModal/ShareInviteModal/ShareInviteModal";
import ShareVoteModal from "../SharepageModal/ShareVoteModal/ShareVoteModal";
import ComfirmVideoModal from "../VideoChattingModal/ComfirmVideoModal";
import "./RootModal.scss";

const RootModal = ({ modalName }: { modalName: string }) => {
  return (
    <>
      <ModalPortal>
        <div className="RootModalWrapper">
          {modalName === "confirmVideoModal" && <ComfirmVideoModal />}
          {modalName === "shareInviteModal" && <ShareInviteModal />}
          {modalName === "shareEndModal" && <ShareEndModal />}
          {modalName === "voteModal" && <ShareVoteModal />}
          {modalName === "memberPageModal" && <MemberPageModal />}
          {modalName === "helpPinModal" && <HelpPinModal />}
        </div>
      </ModalPortal>
    </>
  );
};

export default RootModal;
