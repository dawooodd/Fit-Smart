import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Menu, X, Leaf } from 'lucide-react';

const links = [
  { href: '#fitur', label: 'Fitur' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#kontak', label: 'Kontak' },
];

export default function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FDFBF6]/85 backdrop-blur-lg shadow-[0_8px_30px_-18px_rgba(21,128,61,0.35)]'
          : 'bg-transparent'
      }`}
    >
      <div className={`flex items-center justify-between px-6 md:px-8 max-w-7xl mx-auto transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-green-800 tracking-tight group">
          <span className="w-9 h-9 rounded-xl bg-green-700 text-white flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
            <Leaf className="w-5 h-5" />
          </span>
          FitSmart
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 hover:text-green-700 transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-green-600 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="hidden sm:block press bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-green-700/20"
            onClick={() => navigate('/onboarding')}
          >
            Mulai Sekarang
          </button>
          <button
            onClick={() => navigate('/login')}
            className="press bg-green-100 hover:bg-green-200 text-green-800 px-3 md:px-6 py-2 rounded-full font-medium flex items-center justify-center h-9 md:h-auto md:min-h-10"
            aria-label="Masuk"
          >
            <User className="w-5 h-5 md:mr-2" />
            <span className="hidden md:block whitespace-nowrap text-sm md:text-base">Masuk</span>
          </button>
          <button
            className="md:hidden p-2 rounded-full text-gray-700 hover:bg-green-100 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden animate-fadeUp bg-[#FDFBF6]/95 backdrop-blur-lg border-t border-green-100 px-6 pb-5 pt-2 space-y-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-medium text-gray-700 hover:text-green-700 border-b border-green-50"
            >
              {link.label}
            </a>
          ))}
          <button
            className="press w-full mt-3 bg-green-700 text-white py-3 rounded-full font-medium"
            onClick={() => navigate('/onboarding')}
          >
            Mulai Sekarang
          </button>
        </nav>
      )}
    </header>
  );
}
