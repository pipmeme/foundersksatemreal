import { Link } from "react-router-dom";
const logoSrc = "/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="px-4 sm:container py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img src={logoSrc} alt="Founders KSA" className="h-12 sm:h-16 w-auto mb-3 sm:mb-4" />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your gateway to entrepreneurship in Saudi Arabia. Resources, guides, and real founder stories.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Explore</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { to: "/stories", label: "Founder Stories" },
                { to: "/rising-founders", label: "Rising Founders" },
                { to: "/insights", label: "Insights" },
                { to: "/free-kickstart", label: "Free Kickstart" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Resources</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { to: "/startup-guide", label: "Startup Guide" },
                { to: "/founders-playbook", label: "Founder's Playbook" },
                { to: "/startup-guide/misa-license", label: "MISA License Guide" },
                { to: "/startup-guide/incubators", label: "Incubators" },
                { to: "/about", label: "About Us" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-display font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Get in Touch</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>info@foundersksa.com</li>
              <li>Riyadh, Saudi Arabia</li>
            </ul>
            <div className="flex gap-3 mt-3 sm:mt-4">
              <span className="text-muted-foreground/40 cursor-not-allowed" aria-label="Twitter / X (Coming Soon)" title="Coming Soon">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </span>
              <span className="text-muted-foreground/40 cursor-not-allowed" aria-label="LinkedIn (Coming Soon)" title="Coming Soon">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-border text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Founders KSA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;