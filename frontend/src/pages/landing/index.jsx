import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleContinueClick = () => {
    setPasswordError("");

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setPasswordError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-cream font-sans">
      <Navbar />

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-80px)] gap-12 lg:gap-0 px-6 py-12 lg:px-12 lg:py-0">
        <div className="w-full max-w-screen-xl flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-[#653D15] font-bold text-[64px] leading-tight tracking-tight max-w-xl">
              Gamify your
              <br />
              progression with
              <br />
              THE TEST WAS A SUCCESS
            </h1>
            <p className="text-[#E9A319] font-bold text-[36px] mt-4 whitespace-nowrap">
              Make getting things done easy.
            </p>
          </div>

          {/* Right Column - Sign Up Form */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-center">
            <div className="w-full max-w-[550px] flex flex-col">
              <h2 className="text-[#653D15] font-bold text-[40px] text-center mb-6">
                Sign Up, It&apos;s Free!
              </h2>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#E9A319] text-[#653D15] rounded-[15px] px-5 py-3 text-base placeholder:text-[#653D15] border-none outline-none focus:ring-2 focus:ring-[#653D15] focus:ring-offset-0"
                  aria-label="Username"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#E9A319] text-[#653D15] rounded-[15px] px-5 py-3 text-base placeholder:text-[#653D15] border-none outline-none focus:ring-2 focus:ring-[#653D15] focus:ring-offset-0"
                  aria-label="Password"
                />
                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className="w-full bg-[#E9A319] text-[#653D15] rounded-[15px] px-5 py-3 text-base placeholder:text-[#653D15] border-none outline-none focus:ring-2 focus:ring-[#653D15] focus:ring-offset-0"
                    aria-label="Confirm Password"
                    aria-invalid={!!passwordError}
                    aria-describedby={
                      passwordError ? "password-error" : undefined
                    }
                  />
                  {passwordError && (
                    <p
                      id="password-error"
                      className="text-red-600 text-sm mt-1 ml-2"
                    >
                      {passwordError}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleContinueClick}
                  className="w-[550px] max-w-full bg-[#653D15] text-white rounded-[15px] py-3 font-normal text-base hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
