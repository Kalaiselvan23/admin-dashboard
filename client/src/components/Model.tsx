import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="mt-4">{children}</div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
