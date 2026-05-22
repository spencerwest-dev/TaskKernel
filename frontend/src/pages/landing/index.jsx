import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SignIn, SignUp, useUser } from "@clerk/react";
import Navbar from "./Navbar";

function LandingPage() {
  const [mode, setMode] = useState("signup");
  const location = useLocation();
  const { isLoaded, isSignedIn } = useUser();
  const unauthorized = location.state?.unauthorized;

  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-cream font-sans">
      <Navbar onLoginClick={() => setMode("signin")} />

      {unauthorized && (
        <div className="text-center text-red-600 font-semibold mt-4">
          Please log in to access the dashboard.
        </div>
      )}

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
              {!isLoaded ? (
                <div className="w-full rounded-2xl border border-[#dbb96a] bg-[#fdf6e3] p-8 text-center font-semibold text-[#653d15]">
                  Loading...
                </div>
              ) : mode === "signup" ? (
                  <SignUp
                    routing="virtual"
                    fallbackRedirectUrl="/dashboard"
                    forceRedirectUrl="/dashboard"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "w-full shadow-none border border-[#dbb96a] bg-[#fdf6e3] rounded-2xl",
                      },
                    }}
                  />
                ) : (
                  <SignIn
                    routing="virtual"
                    fallbackRedirectUrl="/dashboard"
                    forceRedirectUrl="/dashboard"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "w-full shadow-none border border-[#dbb96a] bg-[#fdf6e3] rounded-2xl",
                      },
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
