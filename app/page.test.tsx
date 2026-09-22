import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
      homeroom: "Test Homeroom",
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
      GPA: 3.5,
    },
    {
      id: 2,
      name: "Bob",
      homeroom: "Test Homroom",
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
      GPA: 2.1,
    },
    {
      id: 3,
      name: "Claud",
      homeroom: "Test Homroom",
      grades: {
        math: 65,
        reading: 75,
        writing: 70,
        "social studies": 85,
        science: 90,
        PE: 92,
        FACS: 75,
        UA: 68,
      },
      GPA: 3.1,
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
      await screen.findByText(
        "Unable to load student data. Please refresh and try again.",
      ),
    ).toBeInTheDocument();

    expect(screen.queryByText("Loading…")).toBeNull();
  });

  // FILTER: search filter
  it("filters students by student's name", async () => {
    mockFetchSuccess();

    render(<Home />);

    const searchInput = screen.getByPlaceholderText("Search by student's name");

    await userEvent.type(searchInput, "alice");

    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    expect(screen.queryByText("Claud")).not.toBeInTheDocument();
  });

  // INTERVENTION: all
  it("shows students with an intervention in any class", async () => {
    mockFetchSuccess();

    render(<Home />);

    const subjectSelect = screen.getByRole("combobox", {
      name: /needs intervention in/i,
    });

    await userEvent.selectOptions(subjectSelect, "all");

    expect(await screen.findByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Claud")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  // INTERVENTION: subject specefic
  it("shows only students needing intervention in a specific class", async () => {
    mockFetchSuccess();
    render(<Home />);

    const subjectSelect = screen.getByRole("combobox", {
      name: /needs intervention in/i,
    });

    await userEvent.selectOptions(subjectSelect, "writing");

    expect(await screen.findByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Claud")).toBeNull();
    expect(screen.queryByText("Alice")).toBeNull();
  });

  // SORTING
  it("sorts students by name ascending", async () => {
    mockFetchSuccess();
    render(<Home />);

    await waitFor(() => screen.getByText("Bob"));

    const rows = screen.getAllByRole("row");
    const names = rows.map((r) => r.textContent);

    expect(names[1]).toContain("Bob");
    expect(names[2]).toContain("Claud");
  });

  // EMPTY STATE
  it("shows empty state when no students match search", async () => {
    mockFetchSuccess();
    render(<Home />);

    const searchInput = screen.getByPlaceholderText("Search by student's name");
    searchInput.focus();
    fireEvent.change(searchInput, { target: { value: "no results found" } });
    searchInput.dispatchEvent(
      new InputEvent("input", { bubbles: true, data: "zzzz" }),
    );

    const emptyMessage = await screen.findByText(/no students found/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});
