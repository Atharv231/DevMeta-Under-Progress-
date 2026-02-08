import { Code2, Github, Twitter, Linkedin } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-inner">
          {/* Logo */}
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <Code2 className="footer-logo-svg" />
            </div>
            <span className="footer-logo-text">DEVMATE</span>
          </div>

          {/* Copyright */}
          <p className="footer-copy">
            ©Boss _ {new Date().getFullYear()} Devmet. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="footer-social">
            {[
              { icon: Twitter, href: "#" },
              { icon: Github, href: "#" },
              { icon: Linkedin, href: "#" },
            ].map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  className="footer-social-link"
                >
                  <Icon className="footer-social-icon" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
