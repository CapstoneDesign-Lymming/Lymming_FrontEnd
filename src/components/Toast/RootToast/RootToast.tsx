import { useEffect } from "react";
import { ToastPortal } from "../../../helper/Potal";
import SuccessToast from "../BasicToast/SuccessToast";
import "./RootToast.scss";
import { useToastStore } from "../../../store/useToastState";
import ErrorToast from "../ErrorToast/ErrorToast";

const RootToast = ({ toastName }: { toastName: string }) => {
  const { isToastOpen, closeToast, setErrorText, setSuccessText } =
    useToastStore();
  useEffect(() => {
    if (isToastOpen) {
      const toastTimer = setTimeout(() => {
        setErrorText("");
        setSuccessText("");
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
          {toastName === "errorToast" && <ErrorToast />}
        </div>
      </ToastPortal>
    </>
  );
};

export default RootToast;
