import React, { useState } from "react";
import Modal from "react-modal";

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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Circle"
    >
      <h2>Add Circle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            IP Address:
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <p>
            Coordinates: x: {cx}, y: {cy}
          </p>
        </div>
        <button type="submit">Add Circle</button>
        <button type="button" onClick={onRequestClose}>
          Cancel
        </button>
      </form>
    </Modal>
  );
};

export default CreateModal;
