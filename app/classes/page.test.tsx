import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClassesPage from "./page";

describe("Classes page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calculates class averages and flags averages at or below 65", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        students: [
          {
            id: 1,
            name: "Alex",
            homeroom: "Room 1",
            grades: {
              math: 65,
              reading: 65,
              writing: 80,
              "social studies": 80,
              science: 80,
              PE: 80,
              FACS: 80,
              UA: 80,
            },
            GPA: 2.5,
          },
          {
            id: 2,
            name: "Jamie",
            homeroom: "Room 2",
            grades: {
              math: 65,
              reading: 66,
              writing: 80,
              "social studies": 80,
              science: 80,
              PE: 80,
              FACS: 80,
              UA: 80,
            },
            GPA: 2.5,
          },
        ],
      }),
    } as Response);

    render(<ClassesPage />);

    expect(await screen.findByText("Math")).toBeInTheDocument();
    expect(screen.getByText("65.0%")).toBeInTheDocument();
    expect(screen.getByText("65.5%")).toBeInTheDocument();
    expect(screen.getAllByText("Flagged")).toHaveLength(1);
    expect(screen.getByText("1 class flagged")).toBeInTheDocument();
  });
});
