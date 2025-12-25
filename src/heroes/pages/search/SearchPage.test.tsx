import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import SearchPage from "./SearchPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { getSearchHeroesAction } from "@/heroes/actions/get-search-hero.action";
import type { Hero } from "@/heroes/types/hero.interface";

vi.mock("@/heroes/actions/get-search-hero.action");
const mockSearchHeroesAction = vi.mocked(getSearchHeroesAction);
vi.mock("@/components/custom/CustomJumbotron", () => ({
  CustomJumbotron: () => <div data-testid="custom-jumbotrom"></div>,
}));

vi.mock("@/heroes/components/HeroGrid", () => ({
  HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
    <div data-testid="hero-grid">
      {heroes.map((hero) => (
        <div key={hero.id}>{hero.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('./ui/SearchControls', () => ({
  SearchControls: () => <div data-testid="search-page"></div>,
}));

const queryClient = new QueryClient();

const renderSearchPage = (intialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={intialEntries}>
      <QueryClientProvider client={queryClient}>
        <SearchPage />
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Should render with default values", () => {
    const { container } = renderSearchPage();
    expect(mockSearchHeroesAction).toHaveBeenCalledWith({
      name: undefined,
      strength: undefined,
    });
    expect(container).toMatchSnapshot();
  });

  test("should call search action with the name parameter", () => {
    renderSearchPage(["/search?name=superman"]);
    expect(mockSearchHeroesAction).toHaveBeenCalledWith({
      name: "superman",
      strength: undefined,
    });
  });
  test("should call search action with the strength parameter", () => {
    renderSearchPage(["/search?strength=6"]);
    expect(mockSearchHeroesAction).toHaveBeenCalledWith({
      name: undefined,
      strength: "6",
    });
  });
  test("should call search action with the strength and name parameters", () => {
      renderSearchPage([
      "/search?name=superman&strength=10",
    ]);
    expect(mockSearchHeroesAction).toHaveBeenCalledWith({
      name: "superman",
      strength: "10",
    });
  });
  test("should render HeroGrid with search results", async () => {
    const mockHeroes = [
      {
        id: "1",
        name: "Clark Kent",
      } as unknown as Hero,
      {
        id: "2",
        name: "Bruce Wayne",
      } as unknown as Hero,
    ];

    mockSearchHeroesAction.mockResolvedValue(mockHeroes);
    renderSearchPage();

    await waitFor(()=>{
        expect(screen.getByText('Clark Kent')).toBeDefined();
        expect(screen.getByText('Bruce Wayne')).toBeDefined();
    });

    
  });
});
