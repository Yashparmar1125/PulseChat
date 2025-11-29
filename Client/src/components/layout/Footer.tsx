import { Link } from "react-router-dom";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const footerLinks = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Documentation", href: "/documentation" },
    { label: "About", href: "/about" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="bg-pulse-grey-light dark:bg-pulse-white border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle py-16 px-4 sm:px-6 lg:px-8" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">
              Private messaging that just works. Your conversations, secured by design.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-pulse-black dark:text-pulse-black font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-pulse-black/70 dark:text-pulse-black/80 hover:text-pulse-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-pulse-cyan focus:ring-offset-2 focus:ring-offset-pulse-grey-light rounded px-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-pulse-black dark:text-pulse-black font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-pulse-grey-subtle dark:bg-pulse-grey-subtle hover:bg-pulse-cyan text-pulse-black/70 dark:text-pulse-black/80 hover:text-white flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pulse-cyan focus:ring-offset-2 focus:ring-offset-pulse-grey-light"
                    title={social.label}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">
              © 2024 <span className="brand-gradient font-semibold">PULSE</span>. All rights reserved.
            </p>
            <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">Built with privacy in mind.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
