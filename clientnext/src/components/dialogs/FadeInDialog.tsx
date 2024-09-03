import React, { ReactNode, useEffect, useState } from 'react';


interface FadeInDialogProps {
    isOpen: boolean;
    onClose: () => void;
    isModal?: boolean;
    children: ReactNode,
    showDefaultCloserButton?: boolean;
    autoCloseAfterSeconds?: number,
    showCloseTimeSeconds?: boolean
    // color?: string
    // key: Key;
    // onConfirm: () => void;
    // onCancel: () => void
  }


const FadeInDialog : React.FC<FadeInDialogProps> = ({ isOpen, onClose, isModal = true, children, showDefaultCloserButton=true, autoCloseAfterSeconds, showCloseTimeSeconds=false }) => {

  const [remainingTime, setRemainingTime] = useState<number>(autoCloseAfterSeconds || 0);
  // console.log(remainingTime)


  // useEffect(() => {
  //   if (isOpen && autoCloseAfterSeconds) {
  //     const timer = setTimeout(() => {
  //       onClose();
  //     }, autoCloseAfterSeconds*1000);
  //     //multiply by 1000 to convert to seconds

  //     // Cleanup timer if component unmounts or isOpen changes
  //     return () => clearTimeout(timer);
  //   }
  // }, [isOpen, autoCloseAfterSeconds, onClose]);

  useEffect(() => {
    if (isOpen && autoCloseAfterSeconds) {
        setRemainingTime(autoCloseAfterSeconds);
        const timer = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000); // Update every second

        // Cleanup interval if component unmounts or isOpen changes
        return () => clearInterval(timer);
    }
}, [isOpen, autoCloseAfterSeconds, onClose]);

  return (
    <>
      {isOpen && (
        <div className="dialog dark:bg-gray-900 dark:text-gray-300">
          <div className="dialog-content">
            {/* <p>{message}</p> */}
            <div className='flex flex-row justify-between w-full items-center'>
            {
            showDefaultCloserButton &&
            <div>
                <button onClick={onClose}>Ok (x)</button>
            </div>
            }
            {
            showCloseTimeSeconds && 
            autoCloseAfterSeconds && 
            remainingTime > 0 
            && (
                <div className="timer">
                    Closing in {remainingTime} seconds...
                </div>
            )
            }
            </div>
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
          {/* background-color: rgba(255, 255, 255, 1); */}
          border: 1px solid gray;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 0.6rem;
          opacity: 0;
          animation: fadeIn 0.5s forwards;
          font-size: 0.8rem;
          {/* background-color: pink;d */}
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
          padding: 4px 8px;
          cursor: pointer;
          border-radius: 3px;
        }

        .dialog-content button:hover {
          background-color: #0056b3;
        }

        .timer{
          font-size: 0.6rem;
        }
      `}</style>
    </>
  );
};

export {FadeInDialog};
