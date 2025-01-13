import React from 'react';
import { Menu, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const links = [
    { href: '/', label: 'Projects' },
    { href: '/contact', label: 'About & Contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-light tracking-wider text-white">DOMINIC PLATTEN</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                className={`${
                  location.pathname === href
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                } transition-colors duration-200`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
              title="Admin Login"
            >
              <LogIn className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-zinc-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                className={`${
                  location.pathname === href
                    ? 'text-white'
                    : 'text-zinc-400'
                } block px-3 py-2 text-base`}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="text-zinc-400 hover:text-white block px-3 py-2 text-base"
              onClick={() => setIsOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}