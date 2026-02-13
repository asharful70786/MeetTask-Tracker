import React from 'react'
import Dashboard from '../components/Dashboard'
import RecentTranscripts from '../components/RecentTranscripts'
import Footer from './Footer'
import Navbar from '../components/Navbar'


function Landing() {
  return (
    <div  >
      <Navbar/>
      <Dashboard/>


   <section className="bg-gradient-to-b from-[#000000] via-[#0F172A] to-[#064E3B]
">
  <div className="mx-auto max-w-6xl px-4 py-14">
    <RecentTranscripts />
  </div>
</section>

    <Footer/>

    </div>
  )
}

export default Landing