import ModalPortal from "../../../helper/Potal";
// import Usermodal from "../UserModal/UserModal";
import ComfirmVideoModal from "../VideoChattingModal/ComfirmVideoModal";
import "./RootModal.scss";
const RootModal = ({ modalName }: { modalName: string }) => {
  return (
    <>
      <ModalPortal>
        <div className="RootModalWrapper">
          {modalName === "confirmVideoModal" && <ComfirmVideoModal />}
          {/* {modalName === "userModal" && <Usermodal />} */}
        </div>
      </ModalPortal>
    </>
  );
};

export default RootModal;
