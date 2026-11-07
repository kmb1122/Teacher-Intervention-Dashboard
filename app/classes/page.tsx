"use client";

import { useEffect, useMemo, useState } from "react";
import type { Student, StudentGrades } from "@/types/students";

const subjects: { key: keyof StudentGrades; label: string }[] = [
  { key: "math", label: "Math" },
  { key: "reading", label: "Reading" },
  { key: "writing", label: "Writing" },
  { key: "social studies", label: "Social Studies" },
  { key: "science", label: "Science" },
  { key: "PE", label: "PE" },
  { key: "FACS", label: "FACS" },
  { key: "UA", label: "UA" },
];

export default function ClassesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState<
    "ascending" | "descending" | null
  >(null);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch("/api/students");
        if (!response.ok) throw new Error("Unable to load students");
        const data: { students: Student[] } = await response.json();
        setStudents(data.students);
      } catch {
        setError("Unable to load class averages. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadStudents();
  }, []);

  const classes = useMemo(
    () =>
      subjects.map(({ key, label }) => {
        const total = students.reduce(
          (sum, student) => sum + student.grades[key],
          0,
        );
        const average = students.length > 0 ? total / students.length : 0;

        return { key, label, average, studentCount: students.length };
      }),
    [students],
  );
  const sortedClasses = useMemo(() => {
    if (!sortOrder) return classes;

    return [...classes].sort((a, b) =>
      sortOrder === "ascending"
        ? a.average - b.average
        : b.average - a.average,
    );
  }, [classes, sortOrder]);
  const flaggedCount = classes.filter(
    ({ average }) => average <= 65,
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Teacher overview
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Classes
          </h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Review the average grade for each class and identify where students
            may need extra support.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="class-list-heading"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="class-list-heading"
              className="text-lg font-bold text-slate-950"
            >
              Class Grade Averages
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A class average of 65% or below is flagged for attention.
            </p>
          </div>
          <p className="w-fit rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            {flaggedCount} {flaggedCount === 1 ? "class" : "classes"} flagged
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div
            role="row"
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-slate-200 bg-slate-900 px-5 py-4 text-xs font-semibold tracking-wider text-slate-100 sm:grid-cols-[minmax(0,1fr)_9rem_10rem]"
          >
            <span role="columnheader">Class</span>
            <span role="columnheader" className="text-right sm:text-left">
              Students
            </span>
            <span
              role="columnheader"
              aria-sort={sortOrder ?? "none"}
              className="col-span-2 sm:col-span-1"
            >
              <button
                type="button"
                onClick={() =>
                  setSortOrder((current) =>
                    current === "ascending" ? "descending" : "ascending",
                  )
                }
                className="flex w-full cursor-pointer items-center justify-between gap-2 text-left transition hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
              >
                Grade Average
                <span
                  aria-hidden="true"
                  className={`text-xs transition-transform ${sortOrder === "descending" ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
            </span>
          </div>
          {isLoading ? (
            <p role="status" className="px-5 py-12 text-center text-slate-500">
              Loading class averages...
            </p>
          ) : error ? (
            <p role="alert" className="px-5 py-12 text-center text-red-700">
              {error}
            </p>
          ) : students.length === 0 ? (
            <p className="px-5 py-12 text-center text-slate-500">
              No class grade data is available yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {sortedClasses.map(({ key, label, average, studentCount }) => {
                const isFlagged = average <= 65;
                return (
                  <li
                    key={key}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_9rem_10rem]"
                  >
                    <span className="font-semibold text-slate-900">
                      {label}
                    </span>
                    <span className="text-right text-sm text-slate-500 sm:text-left">
                      {studentCount}
                    </span>
                    <span className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:justify-start">
                      <span
                        className={`rounded-lg px-3 py-1.5 font-bold ${isFlagged ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-800"}`}
                      >
                        {average.toFixed(1)}%
                      </span>
                      {isFlagged && (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                          Flagged
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
