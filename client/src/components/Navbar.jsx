import React from 'react'
import { FiZap } from 'react-icons/fi'

function Navbar() {
  return (
   <nav className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-[#0A4B3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F97316] to-[#F59E0B] rounded-xl flex items-center justify-center">
                <FiZap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg">MeetTask</span>
              <span className="px-2 py-1 bg-white/10 rounded-lg text-xs font-medium">Beta</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-white/70 hover:text-white transition-colors">Documentation</button>
              <button className="text-sm text-white/70 hover:text-white transition-colors">Pricing</button>
              <button className="bg-white text-[#064E3B] px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/90 transition-all hover:scale-105">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar