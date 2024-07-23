import { connect } from "API";
import React, { useRef, useState } from "react";
import { IoIosAdd } from "react-icons/io";

const Dialog = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleOpenDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleCloseDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const userId = localStorage.getItem("_u") || "";
    const email: FormDataEntryValue | undefined =
      data.get("email")?.toString() || "";
    const connectRes = await connect({ friendEmail: email, userId });

    if (connectRes.httpCode !== 201) {
      setErrorMsg(connectRes.apiMsg);
    } else {
      handleCloseDialog();
    }
  };

  return (
    <>
      <IoIosAdd
        className="flex-1 w-6 h-6 items-end justify-end"
        onClick={handleOpenDialog}
      />
      {/* <button
        onClick={() => handleOpenDialog}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Open Dialog
      </button> */}

      <dialog
        ref={dialogRef}
        className="fixed z-10 inset-0 overflow-y-auto  bg-opacity-0"
      >
        <div className="flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Invitation</h2>
              <button
                onClick={() => handleCloseDialog()}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter friend's email"
                />
              </div>
              <div>
                {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
                {/* {msg && <p className="text-green-600">{msg}</p>} */}
              </div>

              <div className="text-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Dialog;
