import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
const logoSrc = "/logo.png";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/startup-guide", label: "Startup Guide", exact: false },
  { to: "/stories", label: "Founder Stories", exact: false },
  { to: "/rising-founders", label: "Rising Founders", exact: false },
  { to: "/insights", label: "Insights", exact: false },
  { to: "/about", label: "About", exact: true },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (link: typeof navLinks[0]) =>
    link.exact
      ? location.pathname === link.to
      : location.pathname === link.to || location.pathname.startsWith(link.to + "/");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="px-4 sm:container flex h-14 sm:h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoSrc} alt="Founders KSA" className="h-12 sm:h-16 w-auto" loading="eager" decoding="async" fetchPriority="high" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link)
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild className="gradient-bg border-0 text-primary-foreground hover:opacity-90">
            <Link to="/free-kickstart">Free Kickstart</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="px-4 sm:container py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link)
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="gradient-bg border-0 text-primary-foreground mt-2 text-sm">
              <Link to="/free-kickstart" onClick={() => setIsOpen(false)}>Free Kickstart</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
