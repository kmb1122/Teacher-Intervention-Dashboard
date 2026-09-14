"use client";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import type { Student, StudentGrades } from "@/types/students";
import SortableHeader, {
  type SortableColumn,
} from "./components/sortableHeader";

const subjects = [
  { key: "math", label: "Math" },
  { key: "reading", label: "Reading" },
  { key: "writing", label: "Writing" },
  { key: "social studies", label: "Social Studies" },
  { key: "science", label: "Science" },
  { key: "PE", label: "PE" },
  { key: "FACS", label: "FACS" },
  { key: "UA", label: "UA" },
] as const;

type SortOrder = "ascending" | "descending";
type SubjectKey = (typeof subjects)[number]["key"];

function getSortValue(
  student: Student,
  sortKey: SortableColumn | null,
): string | number {
  if (!sortKey) return 0;
  if (sortKey in student.grades) {
    return student.grades[sortKey as keyof StudentGrades];
  }

  const value = student[sortKey as keyof Student];
  return typeof value === "string" || typeof value === "number" ? value : 0;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [interventionSubject, setInterventionSubject] = useState<
    SubjectKey | "all"
  >("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("ascending");
  const [sortKey, setSortKey] = useState<SortableColumn | null>("id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllStudents, setShowAllStudents] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch("/api/students");
        if (!response.ok) throw new Error("Unable to load students");
        const data: { students: Student[] } = await response.json();
        setStudents(data.students);
      } catch {
        setError("Unable to load student data. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadStudents();
  }, []);

  const visibleStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return students
      .filter((student) =>
        student.name.toLowerCase().includes(normalizedSearch),
      )
      .filter((student) => {
        if (showAllStudents) return true;

        if (interventionSubject === "all") {
          return Object.values(student.grades).some((grade) => grade <= 65);
        }

        return student.grades[interventionSubject] <= 65;
      })
      .sort((a, b) => {
        const first = getSortValue(a, sortKey);
        const second = getSortValue(b, sortKey);

        const valueA = typeof first === "string" ? first.toLowerCase() : first;
        const valueB =
          typeof second === "string" ? second.toLowerCase() : second;

        if (sortOrder === "ascending") {
          return valueA > valueB ? 1 : -1;
        }
        return valueA < valueB ? 1 : -1;
      });
  }, [
    students,
    search,
    interventionSubject,
    showAllStudents,
    sortKey,
    sortOrder,
  ]);

  const hasSearchResults = students.some((student) =>
    student.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Student Intervention Dashboard
          </h2>
          <p className="mt-3 max-w-2xl text-slate-500">
            Review grades, find students quickly, and focus support where it is
            needed most.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:p-5">
          <label className="relative block">
            <span className="sr-only">Search by student name</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by student's name"
              className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="flex w-fit m-auto h-12 items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100 sm:w-full">
            <span className="whitespace-nowrap font-medium text-slate-600">
              Needs intervention in
            </span>
            <select
              value={interventionSubject}
              onChange={(event) => {
                setInterventionSubject(
                  event.target.value as SubjectKey | "all",
                );
                setShowAllStudents(false);
              }}
              className="min-w-28 bg-transparent cursor-pointer font-semibold text-slate-900 outline-none"
            >
              <option value="all">All classes</option>
              {subjects.map((subject) => (
                <option key={subject.key} value={subject.key}>
                  {subject.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex w-fit m-auto h-12 items-center gap-3 rounded-xl border border-slate-300 cursor-pointer font-semibold bg-slate-50 px-4 text-sm focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100 sm:m-0">
            <button
              type="button"
              onClick={() => setShowAllStudents((current) => !current)}
              className="cursor-pointer"
            >
              Show All Students
            </button>
          </label>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-300">
                <tr>
                  <SortableHeader
                    label="ID"
                    columnKey="id"
                    sortKey={sortKey}
                    sortOrder={sortOrder}
                    onSort={(key, order) => {
                      setSortKey(key);
                      setSortOrder(order);
                    }}
                  />

                  <SortableHeader
                    label="Name"
                    columnKey="name"
                    sortKey={sortKey}
                    sortOrder={sortOrder}
                    onSort={(key, order) => {
                      setSortKey(key);
                      setSortOrder(order);
                    }}
                  />

                  <SortableHeader
                    label="Homeroom"
                    columnKey="homeroom"
                    sortKey={sortKey}
                    sortOrder={sortOrder}
                    onSort={(key, order) => {
                      setSortKey(key);
                      setSortOrder(order);
                    }}
                  />

                  {subjects.map((subject) => (
                    <SortableHeader
                      key={subject.key}
                      label={subject.label}
                      columnKey={subject.key}
                      sortKey={sortKey}
                      sortOrder={sortOrder}
                      onSort={(key, order) => {
                        setSortKey(key);
                        setSortOrder(order);
                      }}
                    />
                  ))}

                  <SortableHeader
                    label="GPA"
                    columnKey="GPA"
                    sortKey={sortKey}
                    sortOrder={sortOrder}
                    onSort={(key, order) => {
                      setSortKey(key);
                      setSortOrder(order);
                    }}
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={12} className="px-5 py-16">
                      <div className="flex flex-col items-center justify-center w-full gap-4 text-center">
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="text-slate-800 h-6 w-6 block aspect-square animate-spin"
                        />

                        <span className="text-slate-500 text-lg">
                          Loading students...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-5 py-16 text-center text-red-600"
                    >
                      {error}
                    </td>
                  </tr>
                ) : visibleStudents.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-5 py-16 text-center">
                      <p className="font-semibold text-slate-800">
                        {interventionSubject !== "all" && hasSearchResults
                          ? "No students need intervention for this class."
                          : "No students found."}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try changing the class filter or search term.
                      </p>
                    </td>
                  </tr>
                ) : (
                  visibleStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="transition hover:bg-teal-50/50"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        #{student.id}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                        {student.name}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {student.homeroom}
                      </td>
                      {subjects.map((subject) => {
                        const grade = student.grades[subject.key];
                        return (
                          <td key={subject.key} className="px-5 py-4">
                            <span
                              className={`relative inline-flex min-w-12 justify-center rounded-lg px-2.5 py-1.5 font-semibold ${grade <= 65 ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"}`}
                            >
                              {grade}%
                              {grade <= 65 && (
                                <span
                                  aria-label="Needs intervention"
                                  className="absolute -right-1 -top-1 h-3 w-3 rotate-45 bg-red-500"
                                />
                              )}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-5 py-4 font-bold text-teal-700">
                        {student.GPA.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
