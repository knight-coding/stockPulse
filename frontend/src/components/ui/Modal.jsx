import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({
    open,
    onClose,
    title,
    children,
}) {
    return (
        <AnimatePresence>

            {open && (

                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >

                    <motion.div
                        className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >

                        <div className="mb-5 flex items-center justify-between">

                            <h2 className="text-xl font-bold text-foreground">
                                {title}
                            </h2>

                            <button
                                onClick={onClose}
                            >
                                <X />
                            </button>

                        </div>

                        {children}

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>
    );
}