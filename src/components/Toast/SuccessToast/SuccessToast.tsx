import { AnimatePresence, motion } from "framer-motion";
import "./SuccessToast.scss";
import { useToastStore } from "../../../store/useToastState";
const SuccessToast = () => {
  const { successText } = useToastStore();
  return (
    <AnimatePresence>
      <motion.div
        className="successToastWrapper"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <div className="successToast">
          <svg
            id="successToastIcon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
          </svg>
          {successText ? (
            <div>{successText}</div>
          ) : (
            <div className="toast_words">성공적으로 저장되었습니다</div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessToast;
