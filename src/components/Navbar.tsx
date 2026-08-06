import React, { useEffect, useState } from "react";

export default function NavBar() {
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHideNav(true); // Hide while scrolling down
      } else {
        setHideNav(false); // Show while scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={hideNav ? "hide" : ""}>
      
            <img src="/Logo1.png" alt="CAS Logo" className="w-16 h-10" />


      <nav aria-label="Main navigation">
        <a href="#about">System</a>
        <a href="#work">Modules</a>
        <a href="#metrics">Metrics</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}