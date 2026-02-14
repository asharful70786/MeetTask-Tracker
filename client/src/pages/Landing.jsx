import React from 'react'
import Dashboard from '../components/Dashboard'
import RecentTranscripts from '../components/RecentTranscripts'




function Landing() {
  return (
    <div  >
     
      <Dashboard/>


   <section className="bg-gradient-to-b from-[#000000] via-[#0F172A] to-[#064E3B]
">
  <div className="mx-auto max-w-6xl px-4 py-14">
    <RecentTranscripts />
  </div>
</section>

   

    </div>
  )
}

export default Landing