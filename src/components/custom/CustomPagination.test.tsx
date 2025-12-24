import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { CustomPagination } from "./CustomPagination";
import { MemoryRouter } from "react-router";
import type { PropsWithChildren } from "react";

vi.mock("../ui/button", () => ({
  Button: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>{children}</button>
  ),
}));

const renderWithRouter = (
  component: React.ReactElement,
  initialEntries?: string[]
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
  );
};

describe("CustomPagination", () => {
  test("Should render with default values", () => {
    renderWithRouter(<CustomPagination totalPages={3} />);

    expect(screen.getByText("Anterior")).toBeDefined();
    expect(screen.getByText("Siguiente")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
  });
  test("Should disabled previous button when page is 1", () => {
    renderWithRouter(<CustomPagination totalPages={5} />);

    const previousButton = screen.getByText("Anterior");

    expect(previousButton.getAttributeNames()).toContain("disabled");
  });
  test("Should disabled next button when we are in the last page", () => {
    renderWithRouter(<CustomPagination totalPages={3} />, ["/?page=3"]);

    const nextButton = screen.getByText("Siguiente");

    expect(nextButton.getAttributeNames()).toContain("disabled");
  });
  test("Should disabled button 3 when we are in page 3", () => {
    renderWithRouter(<CustomPagination totalPages={10} />, ["/?page=3"]);

    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");

    expect(button2.getAttribute("variant")).toBe("outline");
    expect(button3.getAttribute("variant")).toBe("default");
  });

  test("should change to next page", () => {
    renderWithRouter(<CustomPagination totalPages={4} />, ["/?page=3"]);
    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");

    expect(button2.getAttribute("variant")).toBe("outline");
    expect(button3.getAttribute("variant")).toBe("default");

    fireEvent.click(button2);
    expect(button2.getAttribute("variant")).toBe("default");
    expect(button3.getAttribute("variant")).toBe("outline");
  });
});
