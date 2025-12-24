import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, test, expect, vi, beforeEach, vitest } from "vitest";
import { HomePage } from "./HomePage";
import { useHeroPaginated } from "@/heroes/hooks/useHeroPaginated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroesContext";

vi.mock("@/heroes/hooks/useHeroPaginated");

const mockUseHeroPaginated = vi.mocked(useHeroPaginated);

mockUseHeroPaginated.mockReturnValue({
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: true,
} as unknown as ReturnType<typeof useHeroPaginated>);

const queryClient = new QueryClient();

const renderHomePage = (intialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={intialEntries}>
      <FavoriteHeroProvider>
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      </FavoriteHeroProvider>
    </MemoryRouter>
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("Should render with default values", () => {
    const { container } = renderHomePage();
    expect(container).toMatchSnapshot();
  });
  test("Should call useHeroPaginated with default values", () => {
    renderHomePage();
    expect(mockUseHeroPaginated).toHaveBeenCalledWith(1, 6, "all");
  });
  test("Should call useHeroPaginated with custom query params", () => {
    renderHomePage(["/?page=2&limit=10&category=villains"]);
    expect(mockUseHeroPaginated).toHaveBeenCalledWith(2, 10, "villains");
  });
  test("Should call useHeroPaginated with default page and same limit on tab clicked", () => {
    renderHomePage(["/?tabs=favorites&page=2&limit=10"]);
    const [allTab, favoritesTab, heroesTab, villainTab] = screen.getAllByRole('tab');
    
    fireEvent.click(villainTab);
    expect(mockUseHeroPaginated).toHaveBeenCalledWith(1, 10, 'villain');

    fireEvent.click(heroesTab);
    expect(mockUseHeroPaginated).toHaveBeenCalledWith(1, 10, 'hero');
    
  });
});
