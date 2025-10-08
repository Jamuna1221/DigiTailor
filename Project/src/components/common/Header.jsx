import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from 'react-i18next'

// Role-based icon renderer with enhanced design
const getRoleIcon = (role) => {
  switch (role) {
    case "admin":
      return (
        <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>
      );
    case "tailor":
      return (
        <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
  }
};

const getRoleText = (role) => {
  switch (role) {
    case "admin":
      return "Administrator";
    case "tailor":
      return "Master Tailor";
    default:
      return "Customer";
  }
};

function Header({ user, onSignOut }) {
  const location = useLocation();
  const { getTotalItems, toggleCart } = useCart();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false);
      setHamburgerMenuOpen(false);
    };
    if (userMenuOpen || hamburgerMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [userMenuOpen, hamburgerMenuOpen]);

  // Google Translate element loader (prevents duplicate load)
  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      const addScript = document.createElement('script');
      addScript.id = 'google-translate-script';
      addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(addScript);
    }
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ta,hi,te,ml,kn,ur,gu',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      }
    };
  }, []);

  const { t } = useTranslation();
  const navigation = [
    { name: t('nav.home'), href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: t('nav.catalog'), href: "/catalog", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { name: t('nav.ai_studio'), href: "/ai-studio", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { name: t('nav.gallery'), href: "/gallery", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: t('nav.contact'), href: "/contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleHamburgerMenu = (e) => {
    e.stopPropagation();
    setHamburgerMenuOpen(!hamburgerMenuOpen);
    setUserMenuOpen(false);
  };

  const handleSignOut = () => {
    setUserMenuOpen(false);
    setHamburgerMenuOpen(false);
    onSignOut && onSignOut();
  };

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl border-b border-gray-100 dark:border-slate-800" 
          : "bg-white/60 dark:bg-slate-900/50 backdrop-blur-md"
      }`}>
        <div className="mx-auto max-w-7xl px-0 sm:px-0 lg:px-0">
          <div className="flex h-20 items-center justify-between">
            {/* Logo with enhanced design */}
            <Link to="/" className="flex items-center space-x-3 group">
<<<<<<< HEAD
            <div id="google_translate_element"></div>
=======
            {/* Language selector */}
              {/* <LanguageSelector /> */}
>>>>>>> b357019b8c8878a628ddadf4e338bd751bbc51cb
              <div className="relative">
                <div 
                  className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl"
                  style={{ 
                    background: 'var(--theme-gradient)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--theme-primary)20'
                  }}
                >
                  <span className="text-xl font-black text-white tracking-tight">DT</span>
                  <div 
                    className="absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity"
                    style={{ background: 'var(--theme-gradient)' }}
                  ></div>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 border-2 border-white shadow-lg animate-pulse"></div>
              </div>
              <div>
                <h1 
                  className="text-2xl font-black bg-clip-text text-transparent tracking-tight"
                  style={{ backgroundImage: 'var(--theme-gradient)' }}
                >
                  DigiTailor
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">Smart Fashion Studio</p>
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-white shadow-lg"
                      : "text-gray-700 dark:text-white dark:hover:bg-slate-800"
                  }`}
                  style={{
                    background: isActive(item.href) ? 'var(--theme-gradient)' : 'transparent',
                    boxShadow: isActive(item.href) ? `0 10px 15px -3px var(--theme-primary)25` : undefined,
                    '--hover-color': 'var(--theme-primary)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.target.style.color = 'var(--theme-primary)'
                      e.target.style.backgroundColor = 'var(--theme-primary)08'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.target.style.color = ''
                      e.target.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <span className="relative z-10">{item.name}</span>
                  {!isActive(item.href) && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  )}
                </Link>
              ))}
              {user && (
                <Link
                  to="/orders"
                  className={`group relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive("/orders")
                      ? "text-white shadow-lg"
                      : "text-gray-700 dark:text-white dark:hover:bg-slate-800"
                  }`}
                  style={{
                    background: isActive("/orders") ? 'var(--theme-gradient)' : 'transparent',
                    boxShadow: isActive("/orders") ? `0 10px 15px -3px var(--theme-primary)25` : undefined
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive("/orders")) {
                      e.target.style.color = 'var(--theme-primary)'
                      e.target.style.backgroundColor = 'var(--theme-primary)08'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive("/orders")) {
                      e.target.style.color = ''
                      e.target.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <span className="relative z-10">{t('nav.orders')}</span>
                  {!isActive("/orders") && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  )}
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              

              {/* Theme toggle */}
              <div className="relative">
                <ThemeToggle showLabel={false} />
              </div>
              {/* Google Translate container */}
              <div 
                id="google_translate_element" 
                className="hidden md:flex items-center justify-center min-w-fit transition-all duration-300 hover:scale-105"
              />
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="hidden md:inline-flex items-center px-6 py-2.5 text-gray-700 font-semibold transition-colors"
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--theme-primary)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = ''
                    }}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105"
                    style={{ 
                      background: 'var(--theme-gradient)',
                      boxShadow: `0 25px 50px -12px var(--theme-primary)25`
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--theme-gradient-hover)'
                      e.target.style.boxShadow = `0 25px 50px -12px var(--theme-primary)40`
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--theme-gradient)'
                      e.target.style.boxShadow = `0 25px 50px -12px var(--theme-primary)25`
                    }}
                  >
                    <span>Get Started</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </>
              ) : (
                <>
                  {/* Loyalty Points Badge */}
                  <div className="hidden md:flex items-center space-x-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-4 py-2 shadow-lg shadow-amber-500/25">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white font-bold text-sm">{user.loyaltyPoints || 0}</span>
                  </div>

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserMenuOpen(!userMenuOpen);
                        setHamburgerMenuOpen(false);
                      }}
                      className="group flex items-center space-x-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 p-2 pr-4 hover:from-purple-50 hover:to-pink-50 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300 shadow-md hover:shadow-xl dark:text-white dark:border dark:border-slate-700"
                    >
                      {getRoleIcon(user.role)}
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {user.firstName}
                        </p>
                        <p className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:text-white">
                          {getRoleText(user.role)}
                        </p>
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                          <p className="text-white font-bold text-lg">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-purple-100 text-sm">{user.email}</p>
                          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur">
                            <span className="text-white text-xs font-semibold">
                              {getRoleText(user.role)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          {user.role === "admin" && (
                            <>
                              <Link
                                to="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-purple-600 hover:bg-purple-50 transition-colors group"
                              >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                                <span className="font-semibold">Admin Dashboard</span>
                              </Link>
                              <div className="mx-4 my-2 border-t border-gray-100"></div>
                            </>
                          )}
                          
                          {user.role === "tailor" && (
                            <>
                              <Link
                                to="/tailor/dashboard"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors group"
                              >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                </div>
                                <span className="font-semibold">Tailor Dashboard</span>
                              </Link>
                              <div className="mx-4 my-2 border-t border-gray-100"></div>
                            </>
                          )}
                          
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-700">My Profile</span>
                          </Link>
                          
                          <Link
                            to="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-700">My Orders</span>
                          </Link>
                          
                          <div className="mx-4 my-2 border-t border-gray-100"></div>
                          
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            <span className="font-semibold">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cart Button */}
                  <button
                    onClick={toggleCart}
                    className="relative p-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all duration-300 group hover:scale-105 shadow-md hover:shadow-xl"
                    aria-label="Toggle cart"
                  >
                    <svg
                      className="w-6 h-6 text-purple-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-bounce">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={toggleHamburgerMenu}
                    className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    <svg
                      className={`w-6 h-6 text-purple-700 transition-transform duration-300 ${
                        hamburgerMenuOpen ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {hamburgerMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Menu Overlay */}
      {user && hamburgerMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setHamburgerMenuOpen(false)}
          ></div>
          
          <div className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Mobile Menu Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getRoleIcon(user.role)}
                  <div>
                    <p className="text-white font-bold text-lg">{user.firstName}</p>
                    <p className="text-purple-100 text-sm">{getRoleText(user.role)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setHamburgerMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur hover:bg-white/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Loyalty Points in Mobile */}
              <div className="inline-flex items-center space-x-2 rounded-full bg-white/20 backdrop-blur px-4 py-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-bold text-sm">{user.loyaltyPoints || 0} Points</span>
              </div>
            </div>

            {/* Mobile Menu Navigation */}
            <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setHamburgerMenuOpen(false)}
                  className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
                      : "bg-gray-100 group-hover:bg-purple-100"
                  }`}>
                    <svg
                      className={`w-5 h-5 ${
                        isActive(item.href) ? "text-white" : "text-gray-600 group-hover:text-purple-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </Link>
              ))}
              
              <Link
                to="/orders"
                onClick={() => setHamburgerMenuOpen(false)}
                className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive("/orders")
                    ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive("/orders")
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
                    : "bg-gray-100 group-hover:bg-purple-100"
                }`}>
                  <svg
                    className={`w-5 h-5 ${
                      isActive("/orders") ? "text-white" : "text-gray-600 group-hover:text-purple-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <span className="font-semibold">Orders</span>
              </Link>

              <div className="my-4 border-t border-gray-200"></div>

              {/* Role-specific Navigation */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setHamburgerMenuOpen(false)}
                  className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive("/admin")
                      ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive("/admin")
                      ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25"
                      : "bg-gray-100 group-hover:bg-amber-100"
                  }`}>
                    <svg
                      className={`w-5 h-5 ${
                        isActive("/admin") ? "text-white" : "text-gray-600 group-hover:text-amber-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold">Admin Dashboard</span>
                </Link>
              )}

              {user.role === "tailor" && (
                <Link
                  to="/tailor-dashboard"
                  onClick={() => setHamburgerMenuOpen(false)}
                  className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive("/tailor-dashboard")
                      ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive("/tailor-dashboard")
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25"
                      : "bg-gray-100 group-hover:bg-emerald-100"
                  }`}>
                    <svg
                      className={`w-5 h-5 ${
                        isActive("/tailor-dashboard") ? "text-white" : "text-gray-600 group-hover:text-emerald-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold">Tailor Dashboard</span>
                </Link>
              )}

              <div className="my-4 border-t border-gray-200"></div>

              {/* Profile Link */}
              <Link
                to="/profile"
                onClick={() => setHamburgerMenuOpen(false)}
                className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive("/profile")
                    ? "bg-gradient-to-r from-gray-100 to-gray-100 text-gray-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive("/profile")
                    ? "bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg shadow-gray-500/25"
                    : "bg-gray-100 group-hover:bg-gray-200"
                }`}>
                  <svg
                    className={`w-5 h-5 ${
                      isActive("/profile") ? "text-white" : "text-gray-600 group-hover:text-gray-700"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="font-semibold">My Profile</span>
              </Link>

              <div className="my-4 border-t border-gray-200"></div>

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  setHamburgerMenuOpen(false);
                  handleSignOut();
                }}
                className="group w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition-all duration-300">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <span className="font-semibold">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu for Non-authenticated Users */}
      {!user && hamburgerMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setHamburgerMenuOpen(false)}
          ></div>
          
          <div className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Mobile Menu Header for Non-authenticated */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                    <span className="text-lg font-black text-white tracking-tight">DT</span>
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg">DigiTailor</h1>
                    <p className="text-purple-100 text-sm">Smart Fashion Studio</p>
                  </div>
                </div>
                <button
                  onClick={() => setHamburgerMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur hover:bg-white/30 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu Navigation for Non-authenticated */}
            <div className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setHamburgerMenuOpen(false)}
                  className={`group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
                      : "bg-gray-100 group-hover:bg-purple-100"
                  }`}>
                    <svg
                      className={`w-5 h-5 ${
                        isActive(item.href) ? "text-white" : "text-gray-600 group-hover:text-purple-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />0
                    </svg>
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </Link>
              ))}

              <div className="my-6 border-t border-gray-200"></div>

              {/* Auth Links */}
              <Link
                to="/login"
                onClick={() => setHamburgerMenuOpen(false)}
                className="group flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-all duration-300">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <span className="font-semibold">Log In</span>
              </Link>

              <Link
                to="/signup"
                onClick={() => setHamburgerMenuOpen(false)}
                className="group flex items-center space-x-4 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center transition-all duration-300">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <span className="font-semibold">Get Started</span>
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;