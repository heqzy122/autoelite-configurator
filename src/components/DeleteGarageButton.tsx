"use client";

import { useState } from "react";
import { deleteConfiguration } from "@/app/_actions/garageActions";
import ConfirmationModal from "./ConfirmationModal";
import toast from 'react-hot-toast';

export default function DeleteGarageButton({ garageItemId }: { garageItemId: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const performDelete = async () => {
    const toastId = toast.loading('Borrando...');
    const result = await deleteConfiguration(garageItemId);
    if (result.error) {
      toast.error(result.error, { id: toastId });
    } else {
      toast.success('Configuración eliminada.', { id: toastId });
    }
  };
  
  const handleDeleteClick = () => {
    const preference = localStorage.getItem('dontAskDeleteConfirmation');
    if (preference === 'true') {
      performDelete();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConfirm = () => {
    if (dontAskAgain) {
      localStorage.setItem('dontAskDeleteConfirmation', 'true');
    }
    performDelete();
  };

  return (
    <>
      <button
        onClick={handleDeleteClick}
        className="flex-1 text-center bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-xs font-semibold"
      >
        Borrar
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        onDontAskAgainChange={setDontAskAgain}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres borrar esta configuración de tu garaje? Esta acción no se puede deshacer."
        confirmButtonText="Sí, Borrar"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </>
  );
}