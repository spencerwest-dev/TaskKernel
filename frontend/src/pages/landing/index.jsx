import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Navbar from "./Navbar";

function LandingPage() {
  const [mode, setMode] = useState("signup");

  return (
    <div className="min-h-screen bg-cream font-sans">
      <Navbar onLoginClick={() => setMode("signin")} />

      <main className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-80px)] gap-12 lg:gap-0 px-6 py-12 lg:px-12 lg:py-0">
        <div className="w-full max-w-screen-xl flex flex-col lg:flex-row items-center gap-12 lg:gap-0">

          {/* Left Column */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-[#653D15] font-bold text-[64px] leading-tight tracking-tight max-w-xl">
              Gamify your
              <br />
              progression with
              <br />
              TaskKernel.
            </h1>
            <p className="text-[#E9A319] font-bold text-[36px] mt-4 whitespace-nowrap">
              Make getting things done easy.
            </p>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-[550px] flex flex-col items-center">
              {mode === "signup" ? (
                <SignUp
                  routing="virtual"
                  afterSignUpUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "w-full shadow-none border border-[#dbb96a] bg-[#fdf6e3] rounded-2xl",
                    }
                  }}
                />
              ) : (
                <SignIn
                  routing="virtual"
                  afterSignInUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "w-full shadow-none border border-[#dbb96a] bg-[#fdf6e3] rounded-2xl",
                    }
                  }}
                />
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default LandingPage;