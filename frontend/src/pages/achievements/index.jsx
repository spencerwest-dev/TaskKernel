import React from "react";
import Navbar from "../dashboard/components/Navbar";
import Footer from "../dashboard/components/Footer";
import AchievementTracker from "../dashboard/components/AchievementTracker";

export default function AchievementsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0ddb8] text-[#653d15]">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-7">
          <AchievementTracker />
        </div>
      </main>
      <Footer />
    </div>
  );
}
