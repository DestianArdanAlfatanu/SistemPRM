import { Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {/* Footer always uses white logo */}
              <img src="/LOGO PRM WHITE.png" alt="LOGO PRM" className="w-25 h-10" />
            </div>
            <p className="text-gray-400 dark:text-gray-300 leading-relaxed mb-6">
              Divisi strategis Telkom Indonesia yang berfokus pada transformasi digital dan solusi teknologi
              enterprise untuk memajukan Indonesia.
            </p>
            <div className="flex space-x-4 text-xl items-center">
              <a
                href="https://www.instagram.com/prmtelkom?igsh=YXVkdWhleTRobmp5"
                className="flex items-center gap-x-2 hover:text-pink-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-6 h-6" />
                <span className="text-base font-medium">Instagram</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Unit</h4>
            <div className="space-y-2 text-gray-400 dark:text-gray-300">
              <div className="hover:text-white transition-colors cursor-pointer">OBL, LEGAL & COMPLIANCE</div>
              <div className="hover:text-white transition-colors cursor-pointer">PROJECT OPERATION</div>
              <div className="hover:text-white transition-colors cursor-pointer">PARTNERSHIP SLA</div>
              <div className="hover:text-white transition-colors cursor-pointer">RESOURCE & INVOICING</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Perusahaan</h4>
            <div className="space-y-2 text-gray-400 dark:text-gray-300">
              <div className="hover:text-white transition-colors cursor-pointer">Tentang Kami</div>
              <div className="hover:text-white transition-colors cursor-pointer">Booking Meeting Room</div>
              <div className="hover:text-white transition-colors cursor-pointer">Unit</div>
              <div className="hover:text-white transition-colors cursor-pointer">Kontak</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} PRM - Telkom Indonesia. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
