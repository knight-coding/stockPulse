import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmationModal({
    open,
    onClose,
    onConfirm,
    title,
    message,
}) {

    return (

        <Modal
            open={open}
            onClose={onClose}
            title={title}
        >

            <p className="text-foreground-secondary">
                {message}
            </p>

            <div className="mt-6 flex justify-end gap-3">

                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="danger"
                    onClick={onConfirm}
                >
                    Delete
                </Button>

            </div>

        </Modal>

    );
}