import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CreatePortfolioModal from "./CreatePortfolioModal";

describe("CreatePortfolioModal", () => {
    it("closes and clears the form only after a successful creation", async () => {
        const onClose = vi.fn();
        const onCreate = vi.fn().mockResolvedValue();

        render(
            <CreatePortfolioModal
                open
                onClose={onClose}
                onCreate={onCreate}
            />
        );

        const nameInput = screen.getByRole("textbox", {
            name: "Portfolio name",
        });
        fireEvent.change(nameInput, {
            target: { value: "  Long term  " },
        });
        fireEvent.click(screen.getByRole("button", {
            name: "Create Portfolio",
        }));

        await waitFor(() => {
            expect(onCreate).toHaveBeenCalledWith({
                name: "Long term",
                description: "",
                brokerName: "",
            });
        });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("keeps the form open and displays the API error when creation fails", async () => {
        const onClose = vi.fn();
        const onCreate = vi.fn().mockRejectedValue({
            response: { data: { message: "A portfolio with this name already exists." } },
        });

        render(
            <CreatePortfolioModal
                open
                onClose={onClose}
                onCreate={onCreate}
            />
        );

        const nameInput = screen.getByRole("textbox", {
            name: "Portfolio name",
        });
        fireEvent.change(nameInput, { target: { value: "Retirement" } });
        fireEvent.click(screen.getByRole("button", {
            name: "Create Portfolio",
        }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "A portfolio with this name already exists."
        );
        expect(nameInput).toHaveValue("Retirement");
        expect(onClose).not.toHaveBeenCalled();
    });
});
