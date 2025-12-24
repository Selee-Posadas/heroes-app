import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { useHeroPaginated } from "./useHeroPaginated";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";

vi.mock("../actions/get-heroes-by-page.action", () => ({
  getHeroesByPageAction: vi.fn(),
}));

const mockGetHeroesByPageAction = vi.mocked(getHeroesByPageAction);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const tankStackCustomProvider = () => {
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useHeroPaginated", () => {
    
    beforeEach(()=>{
        vi.clearAllMocks();
        queryClient.clear();
    });


  test("Should return the initial state (isLoading)", () => {
    const { result } = renderHook(() => useHeroPaginated(1, 6), {
      wrapper: tankStackCustomProvider(),
    });
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
  test("Should return success state with data when API call succeds", async () => {
    const mockHeroData = {
      total: 20,
      pages: 4,
      heroes: [],
    };

    mockGetHeroesByPageAction.mockResolvedValue(mockHeroData);

    const { result } = renderHook(() => useHeroPaginated(1, 6), {
      wrapper: tankStackCustomProvider(),
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.status).toBe('success');
    expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, 'all');
  });

  test("Should call getHeroesByPageAction with arguments", async () => {
    const mockHeroData = {
      total: 20,
      pages: 4,
      heroes: [],
    };

    mockGetHeroesByPageAction.mockResolvedValue(mockHeroData);

    const { result } = renderHook(() => useHeroPaginated(2, 16, 'heroesABC'), {
      wrapper: tankStackCustomProvider(),
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.status).toBe('success');
    expect(mockGetHeroesByPageAction).toHaveBeenCalled();
    expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(2, 16, 'heroesABC');
  });
});
