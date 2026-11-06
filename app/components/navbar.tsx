import Link from "next/link";

function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-base font-bold tracking-tight sm:text-lg"
        >
          Teacher Dashboard
        </Link>
        <ul className="flex items-center gap-5 text-sm font-medium text-white">
          <li>
            <Link
              href="/"
              className="transition hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
            >
              Students
            </Link>
          </li>
          <li>
            <Link
              href="/classes"
              className="transition hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
            >
              Classes
            </Link>
          </li>
          <li>
            <button className="transition cursor-not-allowed">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
