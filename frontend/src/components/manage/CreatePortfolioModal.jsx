import { useState } from "react";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function CreatePortfolioModal({
    open,
    onClose,
    onCreate,
}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        brokerName: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            setError("Portfolio name is required.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            await onCreate({
                ...formData,
                name: formData.name.trim(),
            });

            setFormData({
                name: "",
                description: "",
                brokerName: "",
            });
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not create the portfolio. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Create Portfolio"
        >

            <form onSubmit={handleSubmit} className="space-y-5">

                {error && (
                    <p role="alert" className="text-sm text-error">
                        {error}
                    </p>
                )}

                <Input
                    name="name"
                    placeholder="Portfolio Name"
                    aria-label="Portfolio name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(error)}
                />

                <Input
                    name="description"
                    placeholder="Description (Optional)"
                    value={formData.description}
                    onChange={handleChange}
                />

                <Select
                    name="brokerName"
                    value={formData.brokerName}
                    onChange={handleChange}
                    options={[
                        {
                            value: "NA",
                            label: "Select Broker (Optional)",
                        },
                        {
                            value: "Upstox",
                            label: "Upstox",
                        },
                        {
                            value: "Groww",
                            label: "Groww",
                        },
                        {
                            value: "Zerodha",
                            label: "Zerodha",
                        },
                        {
                            value: "Angel One",
                            label: "Angel One",
                        },
                    ]}
                />

                <div className="flex justify-end gap-3">

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Creating Portfolio..."
                            : "Create Portfolio"}
                    </Button>

                </div>

            </form>

        </Modal>
    );
}
