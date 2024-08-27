import React, { ReactNode } from 'react';


interface FadeInDialogProps {
    isOpen: boolean;
    onClose: () => void;
    isModal?: boolean;
    children: ReactNode,
    showDefaultCloserButton?: boolean;
    // color?: string
    // key: Key;
    // onConfirm: () => void;
    // onCancel: () => void
  }


const FadeInDialog : React.FC<FadeInDialogProps> = ({ isOpen, onClose, isModal = true, children, showDefaultCloserButton=true, }) => {
  return (
    <>
      {isOpen && (
        <div className="dialog">
          <div className="dialog-content">
            {/* <p>{message}</p> */}
            {
            showDefaultCloserButton &&
            <div>
                <button onClick={onClose}>Ok (x)</button>
            </div>
            }
            {children}
            {/* <button onClick={onClose}>Close</button> */}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dialog {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1000;
          background-color: rgba(255, 255, 255, 1);
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          opacity: 0;
          animation: fadeIn 0.5s forwards;
          font-size: 0.8rem;
        }

        .dialog-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          {/* align-items: center; */}
          {/* justify-content: space-between; */}
        }

        .dialog::after {
          content: '';
          position: absolute;
          right: -20px; /* Position to the right of the chat bubble */
          top: 25%;
          transform: translateY(-50%);
          border-width: 10px;
          border-style: solid;
          {/* border-color: transparent transparent transparent #f0f0f0; */}
          border-color: transparent transparent transparent #ccc;
          {/* border-color: #ccc; */}
        }

        {/* .dialog-content p {
          margin: 0;
          color: #333;
        } */}

        .dialog-content button {
          {/* background-color: #007bff; */}
          background-color: black;
          color: white;
          border: none;
          padding: 5px 9px;
          cursor: pointer;
          border-radius: 4px;
        }

        .dialog-content button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </>
  );
};

export {FadeInDialog};
