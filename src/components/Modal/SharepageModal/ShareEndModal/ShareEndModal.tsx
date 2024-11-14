import useModalClose from "../../../../hooks/useModalClose";
import "./ShareEndModal.scss";
const ShareEndModal = () => {
  const { modalRef } = useModalClose();

  return (
    <div ref={modalRef} className="ShareEndModal">
      ShareEndModal
    </div>
  );
};

export default ShareEndModal;
