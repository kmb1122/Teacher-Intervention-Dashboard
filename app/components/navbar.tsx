function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4 sm:px-6 lg:px-8">
        <h1 className="text-base font-bold tracking-tight sm:text-lg">
          Teacher Dashboard
        </h1>
        <ul className="flex items-center gap-5 text-sm font-medium text-white">
          <li>
            <button className="transition cursor-not-allowed">Home</button>
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
