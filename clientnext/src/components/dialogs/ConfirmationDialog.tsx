import { useRef, useEffect, ReactNode, Key } from 'react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    isModal?: boolean;
    children: ReactNode;
    showDefaultCloserButton?: boolean;
    // key: Key;
    // onConfirm: () => void;
    // onCancel: () => void
  }


const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, isModal = true, children, showDefaultCloserButton=true}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef.current) {
        if (isOpen) {
            if (isModal) {
            dialogRef.current.showModal();
            } else {
            dialogRef.current.show();
            }
        } else {
            dialogRef.current.close();
        }
        }
    }, [isOpen, isModal]);

    return (
        <>
        <style jsx>{`
            dialog {
                border: none;
                border-radius: 5px;
                {/* padding: 20px; */}
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 500px;
                width: 80%;
            }

            dialog::backdrop {
                background-color: rgba(0, 0, 0, 0.5);
            }
        `}</style>
        <dialog ref={dialogRef} onClose={onClose} className="dark:bg-gray-900 dark:text-gray-300" >
            {
            showDefaultCloserButton &&
            <div>
                <button onClick={() => dialogRef.current?.close()}>Close (x)</button>
            </div>
            }
            {children}
        </dialog>
        </>
    );
};
  
  

export {ConfirmationDialog};
