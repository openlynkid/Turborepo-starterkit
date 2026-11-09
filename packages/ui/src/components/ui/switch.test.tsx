import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./switch";

describe("Switch", () => {
  it("renders a switch role", () => {
    render(<Switch aria-label="Notifications" />);
    expect(
      screen.getByRole("switch", { name: "Notifications" }),
    ).toBeInTheDocument();
  });

  it("toggles when clicked", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch aria-label="Notifications" onCheckedChange={onCheckedChange} />,
    );

    await userEvent.click(
      screen.getByRole("switch", { name: "Notifications" }),
    );

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("reflects the checked state", () => {
    render(<Switch aria-label="Notifications" checked />);
    expect(
      screen.getByRole("switch", { name: "Notifications" }),
    ).toHaveAttribute("data-state", "checked");
  });
});
