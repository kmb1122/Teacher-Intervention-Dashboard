import Link from "next/link";
import { notFound } from "next/navigation";
import studentsData from "@/data/students.json";
import type { StudentGrades } from "@/types/students";

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

export default async function ClassPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: subjectSlug } = await params;
  const subject = subjects.find(
    ({ key }) => key.replace(/ /g, "-") === subjectSlug,
  );

  if (!subject) notFound();

  const students = studentsData.students;
  const classAverage =
    students.reduce((total, student) => total + student.grades[subject.key], 0) /
    students.length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Link
            href="/classes"
            className="inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
          >
            &larr; All classes
          </Link>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {subject.label}
          </h1>
          <p className="mt-2 text-slate-500">
            {students.length} students · Class average{" "}
            <span className="font-semibold text-slate-800">
              {classAverage.toFixed(1)}%
            </span>
          </p>
        </div>
      </section>

      <section
        aria-labelledby="student-list-heading"
        className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <h2
          id="student-list-heading"
          className="mb-4 text-xl font-bold text-slate-950"
        >
          Students and grades
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div
            role="row"
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-slate-900 px-5 py-4 text-xs font-semibold tracking-wider text-slate-100"
          >
            <span role="columnheader">Student</span>
            <span role="columnheader" className="text-right">
              Grade
            </span>
          </div>
          <ul className="divide-y divide-slate-100">
            {students.map((student) => {
              const grade = student.grades[subject.key];
              const isFlagged = grade <= 65;

              return (
                <li
                  key={student.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/students/${student.id}`}
                      className="rounded-sm font-semibold text-slate-900 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                    >
                      {student.name}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">
                      {student.homeroom}
                    </p>
                  </div>
                  <span
                    className={`rounded-lg px-3 py-1.5 font-bold ${isFlagged ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-800"}`}
                  >
                    {grade}%
                    {isFlagged && (
                      <span className="sr-only">, needs intervention</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
