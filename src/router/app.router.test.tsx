import { describe, test, expect, vi } from "vitest";
import { AppRouter } from "./app.router";
import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
  useParams,
} from "react-router";

vi.mock("../heroes/pages/home/HomePage", () => ({
  HomePage: () => <div data-testid="home-page"></div>,
}));
vi.mock("@/heroes/layouts/HeroesLayout", () => ({
  HeroesLayout: () => (
    <div data-testid="heroes-layout">
      <Outlet />
    </div>
  ),
}));
vi.mock("@/heroes/pages/hero/HeroPage", () => ({
  HeroPage: () => {
    const { idSlug = "" } = useParams();
    return <div data-testid="hero-page">HeroPage - {idSlug}</div>;
  },
}));

vi.mock("@/heroes/pages/search/SearchPage", () => ({
  default: () => <div data-testid="search-page"></div>,
}));

describe("AppRouter", () => {
  test("Should be configured as expected", () => {
    expect(AppRouter.routes).toMatchSnapshot();
  });

  test("should render home page at root path", () => {
    const router = createMemoryRouter(AppRouter.routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId("home-page")).toBeDefined();
  });

  test("should render heropage at /heroes/:idSludg path", () => {
    const router = createMemoryRouter(AppRouter.routes, {
      initialEntries: ["/heroes/batman"],
    });
    render(<RouterProvider router={router} />);
    screen.debug();
    expect(screen.getByTestId("hero-page").innerHTML).toContain("batman");
  });

  test("should render search page at /search path", async () => {
    const router = createMemoryRouter(AppRouter.routes, {
      initialEntries: ["/search"],
    });
    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId("search-page")).toBeDefined();
  });
  test("should redirect to home page for unknown routes", () => {
    const router = createMemoryRouter(AppRouter.routes, {
      initialEntries: ["/un-path-raro"],
    });
    render(<RouterProvider router={router} />);

    screen.debug();
    expect(screen.findByTestId("home-page")).toBeDefined();
  });
});
