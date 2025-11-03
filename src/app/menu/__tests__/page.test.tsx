import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MenuPage from "../page";

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock better-auth
jest.mock('better-auth/react', () => ({
  ...jest.requireActual('better-auth/react'),
  useSession: () => ({
    data: null,
    isPending: false,
    refetch: jest.fn(),
  }),
}));

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          id: 1,
          name: "Test Category",
          displayOrder: 1,
          items: [
            {
              id: 1,
              categoryId: 1,
              name: "Test Item",
              description: "Test Description",
              price: "10",
              imageUrl: null,
              popular: false,
            },
          ],
        },
      ]),
  })
);

describe("MenuPage", () => {
  it("should render menu items after fetching", async () => {
    render(<MenuPage />);

    // Wait for the component to finish fetching and rendering
    await waitFor(() => {
      expect(screen.getByText("Test Item")).toBeInTheDocument();
    });
  });
});
