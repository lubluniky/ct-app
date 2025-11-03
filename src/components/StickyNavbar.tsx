import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './StickyNavbar.css';

type NavLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { id: 'philosophy', label: 'Philosophy', href: '#philosophy' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'models', label: 'Models', href: '#models' },
  { id: 'connect', label: 'Connect', href: '#connect' },
];

interface StickyNavbarProps {
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export const StickyNavbar = ({ 
  ctaText = 'View Dashboard', 
  ctaHref = '/dashboard',
  onCtaClick 
}: StickyNavbarProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0;
      setScrollProgress(progress);

      // Check if page is scrolled
      setIsScrolled(scrolled > 10);

      // Find active section
      updateActiveSection();

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Close mobile menu on scroll
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [mobileMenuOpen]);

  const updateActiveSection = () => {
    const sections = NAV_LINKS.map(link => link.id);
    
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Check if section is in viewport
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveSection(sectionId);
          break;
        }
      }
    }
  };

  const handleNavClick = (href: string, external?: boolean) => {
    setMobileMenuOpen(false);
    
    if (external) {
      navigate(href);
    } else {
      // Smooth scroll to section
      const sectionId = href.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate(ctaHref);
    }
  };

  return (
    <>
      <nav className={`sticky-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Left: Logo */}
          <div className="navbar-logo">
            <span className="font-bold text-lg">BORKISS</span>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="navbar-links-desktop">
            {NAV_LINKS.map(link => (
              <a
                key={link.id}
                href={link.href}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.external);
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: CTA Button + Mobile Menu */}
          <div className="navbar-right">
            {/* Desktop CTA Button */}
            <button
              onClick={handleCtaClick}
              className="cta-button"
            >
              <span className="cta-text">{ctaText}</span>
              <span className="glow-effect"></span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="scroll-progress-bar">
          <div
            className="scroll-progress-fill"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Close button */}
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>

          {/* Mobile Navigation Links */}
          <div className="mobile-nav-links">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.id}
                href={link.href}
                className={`mobile-nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.external);
                }}
                style={{
                  animationDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile CTA Button */}
          <button
            onClick={handleCtaClick}
            className="mobile-cta-button"
            style={{
              animationDelay: mobileMenuOpen ? `${NAV_LINKS.length * 50}ms` : '0ms',
            }}
          >
            <span className="cta-text">{ctaText}</span>
            <span className="glow-effect"></span>
          </button>
        </div>
      </div>
    </>
  );
};

export default StickyNavbar;
