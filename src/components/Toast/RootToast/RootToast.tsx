import { useEffect } from "react";
import { ToastPortal } from "../../../helper/Potal";
import SuccessToast from "../BasicToast/SuccessToast";
import "./RootToast.scss";
import { useToastStore } from "../../../store/useToastState";

const RootToast = ({ toastName }: { toastName: string }) => {
  const { isToastOpen, closeToast } = useToastStore();
  useEffect(() => {
    if (isToastOpen) {
      const toastTimer = setTimeout(() => {
        closeToast();
      }, 3000);
      return () => {
        clearTimeout(toastTimer);
      };
    }
  }, [isToastOpen, closeToast]);
  return (
    <>
      <ToastPortal>
        <div className="RootToastWrapper">
          {toastName === "successToast" && <SuccessToast />}
        </div>
      </ToastPortal>
    </>
  );
};

export default RootToast;
