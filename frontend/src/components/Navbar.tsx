import React from "react";
import { Layers, BarChart3, Settings } from "lucide-react";

const navLinks = [
  { label: "My Modules", icon: <Layers className="w-4 h-4 mr-1" />, href: "#modules" },
  { label: "Analytics", icon: <BarChart3 className="w-4 h-4 mr-1" />, href: "#analytics" },
  { label: "Settings", icon: <Settings className="w-4 h-4 mr-1" />, href: "#settings" },
];

const Navbar: React.FC = () => (
  <nav className="w-full flex items-center justify-between px-6 py-4 bg-transparent fixed top-0 left-0 z-30">
    <div className="flex items-center select-none">
      <span className="text-xl font-extrabold tracking-tight text-white font-[Sora]">Vok</span>
      <span className="text-xl font-medium tracking-tight text-white font-[Sora]">.ai</span>
    </div>
    <div className="hidden md:flex gap-6">
      {navLinks.map(link => (
        <a
          key={link.label}
          href={link.href}
          className="flex items-center text-white/80 hover:text-white font-medium text-sm transition-colors px-3 py-2 rounded-lg"
        >
          {link.icon}
          {link.label}
        </a>
      ))}
    </div>
    {/* Mobile: show icons only, or a hamburger for future expansion */}
    <div className="flex md:hidden gap-3">
      {navLinks.map(link => (
        <a
          key={link.label}
          href={link.href}
          className="text-white/80 hover:text-white p-3 rounded-lg"
          aria-label={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  </nav>
);

export default Navbar; 