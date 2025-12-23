import React from "react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { SuccessMessageModal } from "../components/SuccessMessage";
import axios from "axios";
import { useRef } from "react";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    status: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const closeModal = () => {
    idempotencyKeyRef.current = crypto.randomUUID(); // NEW intent
    setIsModalOpen(false);
  };
  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name[0].toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  id="amount"
                  placeholder="Enter amount"
                />
              </div>
              <button
                disabled={loading}
                onClick={async () => {
                  if (loading) return;

                  setLoading(true);

                  const txData = {
                    to: id,
                    amount: parseInt(amount),
                  };

                  await initiateTransfer(
                    txData,
                    setModalContent,
                    openModal,
                    idempotencyKeyRef.current
                  );

                  setLoading(false);
                }}
                className={`justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full 
    ${loading ? "bg-gray-400" : "bg-green-500"} text-white`}
              >
                {loading ? "Processing..." : "Initiate Transfer"}
              </button>

              {isModalOpen && (
                <SuccessMessageModal
                  status={modalContent.status}
                  description={modalContent.description}
                  show={isModalOpen}
                  onClose={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const initiateTransfer = async (
  txData,
  setModalContent,
  openModal,
  idempotencyKey
) => {
  try {
    const { status } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/account/transfer`,
      txData,
      {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
          "Idempotency-Key": idempotencyKey,
        },
      }
    );

    if (status === 200) {
      setModalContent({
        status: "Successful",
        description: `Transfer of ${txData.amount} is successful.`,
      });
    } else {
      setModalContent({
        status: "Failed",
        description: `Transfer of ${txData.amount} failed.`,
      });
    }
  } catch (error) {
    if (error.response) {
      setModalContent({
        status: "Error",
        description: error.response.data.message,
      });
    } else {
      setModalContent({
        status: "Error",
        description: "Something went wrong",
      });
    }
  } finally {
    openModal();
  }
};
