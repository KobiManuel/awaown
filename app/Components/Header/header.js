"use client";

import React, { useState } from "react";
import AnnouncementBar from "./AnnouncementBar";
import MainHeader from "./MainHeader";
import CategoryNav from "./CategoryNav";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Not sticky: scrolls away naturally, so it never fights the sticky
          nav's layout height (that's what caused the wobble). */}
      <AnnouncementBar />
      <header className="sticky top-0 z-50 w-full">
        <MainHeader onMenuClick={() => setMobileOpen(true)} />
        <CategoryNav />
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

export default Header;
