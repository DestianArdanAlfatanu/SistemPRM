import { useState, useEffect } from "react"
import { Menu, X, LogIn, UserPlus, User, LogOut, Settings, Shield } from "lucide-react"
import { Link, router, usePage } from "@inertiajs/react"
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

interface NavbarProps {
  activeSection: string
  scrollToSection: (sectionId: string) => void
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
}

interface PageProps {
  auth: {
    user: {
      id: string
      name: string
      email: string
      role: 'admin' | 'user'
    } | null
  }
}

export function Navbar({ activeSection, scrollToSection, isMenuOpen, setIsMenuOpen }: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  type NewType = PageProps

  const { auth } = usePage<NewType>().props

  // Added theme detection with MutationObserver
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"))
    }

    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const navigationItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "booking", label: "Booking" },
    { id: "unit", label: "Unit" },
    { id: "team", label: "Team" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ]

  const cleanup = useMobileNavigation();
  
  const handleLogout = () => {
    cleanup();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    router.post('/logout', {}, {
      onFinish: () => {
        router.flushAll();
      }
    });
  };  

  return (
    <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div>
              {/* Logo switches based on dark mode */}
              <img src={isDarkMode ? "/LOGO PRM WHITE.png" : "/LOGO PRM.png"} alt="LOGO PRM" className="w-25 h-10" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-blue-900 dark:hover:text-blue-400 ${
                    activeSection === item.id ? "text-blue-900 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Auth section */}
            <div className="flex items-center space-x-3">
              {auth.user ? (
                // User dropdown
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span>{auth.user.name}</span>
                    {auth.user.role === 'admin' && (
                      <Shield className="w-4 h-4 text-blue-600" />
                    )}
                  </button>

                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{auth.user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{auth.user.email}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">{auth.user.role}</p>
                      </div>
                      
                      {auth.user.role === 'admin' && (
                        <Link
                          href="/admin/bookings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Shield className="w-4 h-4 mr-3" />
                          Admin Panel
                        </Link>
                      )}
                      
                      
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3 ml-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Guest buttons
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-sm font-medium transition-colors hover:text-blue-900 dark:hover:text-blue-400 ${
                    activeSection === item.id
                      ? "text-blue-900 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Auth section */}
              <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                {auth.user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="px-2 py-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{auth.user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{auth.user.email}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">{auth.user.role}</p>
                    </div>
                    
                    {auth.user.role === 'admin' && (
                      <Link
                        href="/admin/bookings"
                        className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Click outside to close dropdown */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  )
}