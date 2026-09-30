import Link from "next/link";
import { notFound } from "next/navigation";
import studentsData from "@/data/students.json";

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

export default async function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentId = Number(id);
  const student = studentsData.students.find((entry) => entry.id === studentId);

  if (!Number.isInteger(studentId) || !student) notFound();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-semibold text-teal-700 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
          >
            &larr; All students
          </Link>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {student.name}
          </h2>
          <div className="mt-6 grid gap-6 border-t border-slate-200 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Homeroom teacher
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {student.homeroom}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                GPA
              </p>
              <p className="mt-1 text-lg font-semibold text-teal-800">
                {student.GPA.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-slate-950">Grades</h3>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-xs uppercase text-slate-300">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Class
                </th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((subject) => {
                const grade = student.grades[subject.key];
                const needsIntervention = grade < 65;

                return (
                  <tr key={subject.key}>
                    <th
                      scope="row"
                      className="px-5 py-4 font-medium text-slate-800"
                    >
                      {subject.label}
                    </th>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`inline-flex min-w-16 justify-center rounded-md px-3 py-1.5 font-semibold ${needsIntervention ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-slate-100 text-slate-700"}`}
                      >
                        {grade}%
                        {needsIntervention && (
                          <span className="sr-only">, needs intervention</span>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
