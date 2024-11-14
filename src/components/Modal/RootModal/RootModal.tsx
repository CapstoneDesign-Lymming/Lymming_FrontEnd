import { ModalPortal } from "../../../helper/Potal";
import ShareEndModal from "../SharepageModal/ShareEndModal/ShareEndModal";
import ShareInviteModal from "../SharepageModal/ShareInviteModal/ShareInviteModal";
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
        </div>
      </ModalPortal>
    </>
  );
};

export default RootModal;
