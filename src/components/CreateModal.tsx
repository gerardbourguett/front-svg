import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (description: string, ip_address: string) => void;
  cx: number;
  cy: number;
}

const CreateModal: React.FC<ModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
  cx,
  cy,
}) => {
  const [description, setDescription] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(description, ipAddress);
    setDescription("");
    setIpAddress("");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 p-4 bg-white rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Añadir Punto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Descripción:
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Dirección IP:
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                required
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </label>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Coordenadas: x: {cx}, y: {cy}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onRequestClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
