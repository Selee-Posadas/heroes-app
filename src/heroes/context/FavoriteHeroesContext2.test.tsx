import { use } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from "./FavoriteHeroesContext";
import type { Hero } from "../types/hero.interface";

const mockHero = {
  id: "1",
  name: "Clark Kent",
} as Hero;

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const TestComponent = () => {
  const { favoriteCount, favorites, isFavorite, toggleFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      <div data-testid="favorite-count">{favoriteCount}</div>
      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>

      <button
        data-testid="toggle-favorite"
        onClick={() => toggleFavorite(mockHero)}
      >
        Toggle Favorite
      </button>

      <div data-testid="is-favorite">{isFavorite(mockHero).toString()}</div>
    </div>
  );
};

const renderContextTest = () => {
  return render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>
  );
};

describe("FavoriteHeroesContext", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should initialice with the default values", () => {
    renderContextTest();
    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
  });

  test("Should add hero to favorites when toggleFavorite is called with new hero", () => {
    renderContextTest();
    const button = screen.getByTestId("toggle-favorite");

    fireEvent.click(button);

    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("Clark Kent");
    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'favorites',
      '[{"id":"1","name":"Clark Kent"}]'
    );
  });

  test("Should remove hero to favorites when toggleFavorite is called", () => {
    // localStorage.clear();
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));
    renderContextTest();
    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("Clark Kent");

    const button = screen.getByTestId("toggle-favorite");
    fireEvent.click(button);
    
    
    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite").textContent).toBe("false");
    expect(screen.queryByTestId("hero-1")).toBeNull();

    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'favorites',
      '[]'
    );
    
  });
});
