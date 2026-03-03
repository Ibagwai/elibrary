import { branding } from '@/lib/theme'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">{branding.logoIcon}</span>
              <div>
                <div className="font-bold text-white text-lg">{branding.appName}</div>
                <div className="text-xs text-gray-400">{branding.appTagline}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {branding.schoolName} - Access thousands of ebooks, journals, research projects, and lectures.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/browse" className="hover:text-white transition-colors">Browse Content</a></li>
              <li><a href="/search" className="hover:text-white transition-colors">Search</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/browse?category=science" className="hover:text-white transition-colors">Science</a></li>
              <li><a href="/browse?category=technology" className="hover:text-white transition-colors">Technology</a></li>
              <li><a href="/browse?category=engineering" className="hover:text-white transition-colors">Engineering</a></li>
              <li><a href="/browse?category=medicine" className="hover:text-white transition-colors">Medicine</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><a href={`mailto:${branding.contactEmail}`} className="hover:text-white transition-colors">{branding.contactEmail}</a></li>
              <li><a href={`tel:${branding.contactPhone}`} className="hover:text-white transition-colors">{branding.contactPhone}</a></li>
              <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} {branding.schoolName}. {branding.footerText}</p>
        </div>
      </div>
    </footer>
  )
}
