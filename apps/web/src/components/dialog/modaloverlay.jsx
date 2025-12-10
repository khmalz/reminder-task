import React from "react";
import { X } from "lucide-react";

const ModalOverlay = ({ onClose, children }) => {
   return (
      <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
         <div className="animate-in zoom-in-95 relative w-full max-w-md rounded-2xl bg-[#7B95A6] p-6 text-white shadow-2xl duration-200">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-200 transition hover:text-white">
               <X size={24} />
            </button>
            {children}
         </div>
      </div>
   );
};

export default ModalOverlay;
