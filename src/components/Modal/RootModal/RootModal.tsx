import ModalPortal from "../../../helper/Potal";
import ComfirmVideoModal from "../VideoChattingModal/ComfirmVideoModal";
import "./RootModal.scss";
const RootModal = ({ modalName }: { modalName: string }) => {
  return (
    <>
      <ModalPortal>
        <div className="RootModalWrapper">
          {modalName === "confirmVideoModal" && <ComfirmVideoModal />}
          {modalName === "confirmModal" && <ComfirmVideoModal />}
        </div>
      </ModalPortal>
    </>
  );
};

export default RootModal;
