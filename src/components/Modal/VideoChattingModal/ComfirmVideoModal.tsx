import { useEffect, useRef } from "react";
import useModalStore from "../../../store/useModalState";
import "./ComfirmVideoModal.scss";
import useConfirmVideoStore from "../../../store/useComfirmVideoStore";

const ComfirmVideoModal = () => {
  const { closeModal } = useModalStore();
  const { setConfirmVideo } = useConfirmVideoStore();
  const modalRef = useRef<HTMLDivElement>(null);

  //modal외 요소 클릭시 닫힘
  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node))
        closeModal();
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, [closeModal]);

  return (
    <div ref={modalRef} className="ComfirmVideoModal">
      <div className="ModalHeader">
        <svg
          onClick={closeModal}
          id="modalCloseIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
        </svg>
      </div>
      <div className="ModalBody">
        <div
          className="ModalBody-ComformBtn"
          onClick={() => {
            setConfirmVideo(true);
            closeModal();
          }}
        >
          비디오 및 오디오 연결하기
        </div>
      </div>
      <div className="ModalFooter">
        <div className="ModalFooter-QuitText">화상채팅 종료하기</div>
      </div>
    </div>
  );
};

export default ComfirmVideoModal;
