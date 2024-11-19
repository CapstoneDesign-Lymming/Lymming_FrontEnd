import { AnimatePresence, motion } from "framer-motion";
import "./ErrorToast.scss";
import { useToastStore } from "../../../store/useToastState";

const ErrorToast = () => {
  const { errorText } = useToastStore();
  return (
    <AnimatePresence>
      <motion.div
        className="errorToastWrapper"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <div className="errorToast">
          <svg
            id="errorToastIcon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
          </svg>
          <div className="toast_words">{errorText}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorToast;
