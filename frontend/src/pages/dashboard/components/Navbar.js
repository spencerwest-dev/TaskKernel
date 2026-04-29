import React from "react";
import { useClerk } from "@clerk/clerk-react";

function Navbar() {
  const { signOut } = useClerk();

  return (
    <nav className="bg-[#653d15] text-[#fdf6e3]">
      <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between gap-4 px-5 md:px-7">
        <div className="flex items-center gap-2.5">
          <img
            src={`${process.env.PUBLIC_URL || ""}/TKlogo.svg`}
            alt="TaskKernel"
            width={34}
            height={34}
            className="h-[34px] w-[34px] flex-none"
          />
          <span className="text-[20px] font-bold leading-none tracking-tight">
            TaskKernel
          </span>
        </div>
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: "/" })}
          className="rounded-full border border-[#e9a319]/35 bg-[#e9a319]/20 px-4 py-1.5 text-xs font-semibold text-[#f5e0b0] transition hover:bg-[#e9a319]/35 hover:text-[#fdf6e3]"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;