import type { PropsWithChildren } from "react";
import { describe, test, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useHeroSummary } from "./useHeroSummary";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getSummaryAction } from "../actions/get-summary.action";
import type { SummaryResponse } from "../types/get-summary.response";

vi.mock("../actions/get-summary.action", () => ({
  getSummaryAction: vi.fn(),
}));

const mockGetSummaryAction = vi.mocked(getSummaryAction);

const tankStackCustomProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useHeroSummary", () => {
  test("Should return the initial state (isLoading)", () => {
    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tankStackCustomProvider(),
    });
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  test("should return success state with data when API call succeeds", async () => {
    const mockSummaryData = {
      totalHeroes: 10,
      strongestHero: {
        id: "1",
        name: "Clark Kent",
      },
      smartestHero: {
        id: "2",
        name: "Bruce Wayne",
      },
      heroCount: 18,
      villainCount: 7,
    } as SummaryResponse;

    mockGetSummaryAction.mockResolvedValue(mockSummaryData);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tankStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isError).toBe(false);
    expect(mockGetSummaryAction).toHaveBeenCalled();
  });

  test("should return error when API call falls", async () => {
    const mockError = new Error("Failed to fetch summary");
    mockGetSummaryAction.mockRejectedValue(mockError);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tankStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toBeDefined();
    expect(result.current.isLoading).toBe(false);
    expect(mockGetSummaryAction).toHaveBeenCalled();
    expect(result.current.error?.message).toBe("Failed to fetch summary");
  });
});
