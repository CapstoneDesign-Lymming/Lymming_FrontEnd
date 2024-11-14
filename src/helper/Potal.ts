import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalPortalProps {
  children: ReactNode;
}
interface ToastPortalProps {
  children: ReactNode;
}
export const ModalPortal = ({ children }: ModalPortalProps) => {
  const el = document.getElementById("modal");
  return el ? ReactDOM.createPortal(children, el) : null;
};
export const ToastPortal = ({ children }: ToastPortalProps) => {
  const el = document.getElementById("toast");
  return el ? ReactDOM.createPortal(children, el) : null;
};
