// src/components/ConfirmationModal.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  onDontAskAgainChange: (checked: boolean) => void;
  confirmButtonClass?: string;
  confirmButtonText?: string;
}

export default function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    onDontAskAgainChange,
    confirmButtonClass = "bg-green-600 hover:bg-green-700", // Color verde por defecto
    confirmButtonText = "Confirmar"
}: Props) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* CAMBIO: max-w-md a max-w-sm para hacerlo más estrecho */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 border border-gray-700 text-center" // CAMBIO: text-center añadido
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-300 mb-6">{message}</p>
          
          <div className="flex items-center justify-center mb-6">
            <input 
              id="dont-ask-again"
              type="checkbox"
              className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
              onChange={(e) => onDontAskAgainChange(e.target.checked)}
            />
            <label htmlFor="dont-ask-again" className="ml-2 text-sm text-gray-400">
              No volver a preguntar
            </label>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-6 py-2 rounded-md text-white font-semibold transition-colors ${confirmButtonClass}`}
            >
              {confirmButtonText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}