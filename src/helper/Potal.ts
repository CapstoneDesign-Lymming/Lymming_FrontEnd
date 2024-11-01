import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalPortalProps{
    children:ReactNode;
}

const ModalPortal=({children}:ModalPortalProps)=>{
    const el = document.getElementById("modal");
    return el? ReactDOM.createPortal(children,el):null;
}

export default ModalPortal