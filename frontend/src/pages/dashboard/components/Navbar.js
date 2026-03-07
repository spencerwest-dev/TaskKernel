import React from "react";

function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
        <div className="flex items-center gap-5">
          <h2 className="text-sm font-extrabold tracking-wide">TaskKernel</h2>
          <ul className="hidden items-center gap-4 text-xs text-slate-200 md:flex">
            <li className="hover:text-white">Dashboard</li>
            <li className="hover:text-white">Tasks</li>
            <li className="hover:text-white">Progress</li>
            <li className="hover:text-white">Profile</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
