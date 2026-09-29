import { useEffect, useState } from "react";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function HoldingFormModal({
    open,
    onClose,
    holding = null,
    onSave,
}) {

    const [formData, setFormData] = useState({
        symbol: "",
        quantity: "",
        purchasePrice: "",
    });


    useEffect(() => {

        if (holding) {

            setFormData({
                symbol: holding.symbol || "",
                quantity: holding.quantity || "",
                purchasePrice: holding.purchasePrice || "",
            });

        } else {

            setFormData({
                symbol: "",
                quantity: "",
                purchasePrice: "",
            });

        }

    }, [holding, open]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    const handleSubmit = () => {

        if (
            !formData.symbol ||
            !formData.quantity ||
            !formData.purchasePrice
        ) {
            return;
        }

        onSave({
            symbol: formData.symbol.trim().toUpperCase(),
            quantity: Number(formData.quantity),
            purchasePrice: Number(formData.purchasePrice),
        });

    };


    return (
        <Modal
            open={open}
            onClose={onClose}
            title={
                holding
                    ? "Edit Holding"
                    : "Add Holding"
            }
        >

            <div className="space-y-5">

                <Input
                    name="symbol"
                    placeholder="Stock Symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                    disabled={!!holding}
                />

                <Input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                />

                <Input
                    type="number"
                    name="purchasePrice"
                    placeholder="Purchase Price"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                />


                <div className="flex justify-end gap-3">

                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                    >
                        {
                            holding
                                ? "Update Holding"
                                : "Add Holding"
                        }
                    </Button>

                </div>

            </div>

        </Modal>
    );
}