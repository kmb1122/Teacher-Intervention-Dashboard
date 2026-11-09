import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import studentsData from "@/data/students.json";
import ClassPage from "./page";

describe("Class detail page", () => {
  it("shows all students with their grade for the selected class", async () => {
    const page = await ClassPage({
      params: Promise.resolve({ subject: "math" }),
    });

    render(page);

    expect(
      screen.getByRole("heading", { name: "Math", level: 1 }),
    ).toBeInTheDocument();

    const studentLinks = screen.getAllByRole("link").filter((link) =>
      link.getAttribute("href")?.startsWith("/students/"),
    );
    expect(studentLinks).toHaveLength(studentsData.students.length);
    expect(screen.getByRole("link", { name: "Ava Johnson" })).toHaveAttribute(
      "href",
      `/students/${studentsData.students[0].id}`,
    );

    const avaLink = screen.getByRole("link", { name: "Ava Johnson" });
    expect(avaLink.closest("li")).toHaveTextContent("95%");
  });

  it("resolves class slugs containing hyphens", async () => {
    const page = await ClassPage({
      params: Promise.resolve({ subject: "social-studies" }),
    });

    render(page);

    expect(
      screen.getByRole("heading", { name: "Social Studies", level: 1 }),
    ).toBeInTheDocument();
  });
});
