import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Home from "./page";
import { it, expect, beforeEach, describe, vi } from "vitest";

describe("Home page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockStudents = [
    {
      id: 1,
      name: "Alice",
      grades: {
        math: 90,
        reading: 70,
        writing: 88,
        "social studies": 92,
        science: 85,
        PE: 100,
        FACS: 95,
        UA: 80,
      },
    },
    {
      id: 2,
      name: "Bob",
      grades: {
        math: 50,
        reading: 55,
        writing: 60,
        "social studies": 40,
        science: 65,
        PE: 70,
        FACS: 75,
        UA: 60,
      },
    },
  ];

  function mockFetchSuccess() {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ students: mockStudents }),
    } as Response);
  }

  function mockFetchFailure() {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
    } as Response);
  }

  // LOADING STATE
  it("shows loading state initially", () => {
    mockFetchSuccess();
    render(<Home />);
    expect(screen.getByText("Loading students...")).toBeInTheDocument();
  });

  // SUCCESSFUL FETCH
  it("loads and displays students needing intervention", async () => {
    mockFetchSuccess();
    render(<Home />);

    expect(await screen.findByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  // ERROR STATE
  it("shows error message when API fails", async () => {
    mockFetchFailure();
    render(<Home />);

    expect(
      await screen.getByText(
        "Unable to load student data. Please refresh and try again.",
      ),
    ).toBeInTheDocument();

    expect(screen.queryByText("Loading…")).toBeNull();
  });

  // FILTER: search filter
  it("filters students by student's name", async () => {
    mockFetchSuccess();
    render(<Home />);

    await waitFor(() => screen.getByText("Alice"));

    const searchInput = screen.getByPlaceholderText("Search students");
    searchInput.focus();
    fireEvent.change(searchInput, { target: { value: "alice" } });
    searchInput.dispatchEvent(
      new InputEvent("input", { bubbles: true, data: "alice" }),
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).toBeNull();
  });

  // INTERVENTION LOGIC
  it("shows only students needing intervention when showAllStudents=false", async () => {
    mockFetchSuccess();
    render(<Home />);

    expect(await screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).toBeNull();
  });

  // SORTING
  it("sorts students by name ascending", async () => {
    mockFetchSuccess();
    render(<Home />);

    await waitFor(() => screen.getByText("Alice"));

    const rows = screen.getAllByRole("row");
    const names = rows.map((r) => r.textContent);

    // Alice should appear before Bob
    expect(names[1]).toContain("Alice");
    expect(names[0]).toContain("Bob");
  });

  // EMPTY STATE
  it("shows empty state when no students match search", async () => {
    mockFetchSuccess();
    render(<Home />);

    await waitFor(() => screen.getByText("Alice"));

    const searchInput = screen.getByPlaceholderText("Search students");
    searchInput.focus();
    fireEvent.change(searchInput, { target: { value: "no results found" } });
    searchInput.dispatchEvent(
      new InputEvent("input", { bubbles: true, data: "zzzz" }),
    );

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });
});
