import React from "react";

export default function Navbar({ onLoginClick }) {
  return (
    <nav className="w-full bg-cream flex items-center justify-between px-6 py-4 lg:px-12">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <img
            src={`${process.env.PUBLIC_URL || ""}/TKlogo.svg`}
            alt="TaskKernel"
            width={35}
            height={35}
            className="flex-shrink-0"
          />
          <span className="text-[#653D15] font-bold text-[40px] tracking-tight">
            TaskKernel
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#get-started"
            className="text-[#653D15] font-medium no-underline hover:opacity-80"
          >
            Get Started
          </a>
          <a
            href="#learn-more"
            className="text-[#653D15] font-medium no-underline hover:opacity-80"
          >
            Learn More
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={onLoginClick}
        className="justify-self-end w-[166px] bg-[#653D15] text-white rounded-[15px] px-6 py-2 font-normal hover:opacity-90 transition-opacity"
      >
        Login
      </button>
    </nav>
  );
}