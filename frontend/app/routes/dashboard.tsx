import React from "react";
//tailwind
export default function Index() {
  return (
    <div id="main-text">
      <div className="mb-20">
        <h1 className="text-4xl font-semibold mb-16 text-center">GWU SEC Privacy Label Observatory Dashboard</h1>
        <h2 className="text-lg text-white-700 mb-4 text-center">
          We collected nearly weekly snapshots of the privacy labels of 1.6+ million apps over the span of a year. Explore our database:
        </h2>
        <div class="flex justify-center items-center space-x-4">
          <button class="px-4 py-1 text-lg font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">the Apps</button>
          <button class="px-4 py-1 text-lg font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">the Graphs</button>
        </div>
      </div>
      <div className="mb-16">
        <p className="text-lg text-white-700 mb-16 text-center">
          After 2021, Apple Store required apps updating or being put on the app store for the first time to specify privacy labels. The various choices made by developers of apps are reflected here, whether it be underreporting data or reporting well, and the reasons behind each.
        </p>
      </div>
      <div className="mb-16">
        <h1 className="text-3xl mb-8 text-white-700 text-center">But what are privacy labels?</h1>
        <p className="text-lg text-white-300 font-medium text-center mb-4">Privacy labels are basically nutrition labels, where the app must indicate what data is collected and used compactly.</p>
        <a href="#track" className="text-md text-slate-600 font-medium hover:text-white text-center mb-4 block" onclick="smoothScroll(event, '#track')">Data Used to Track You</a>
        <a href="#linked" className="text-md text-slate-600 font-medium hover:text-white text-center mb-4 block" onclick="smoothScroll(event, '#linked')">Data Linked to You</a>
        <a href="#n_linked" className="text-md text-slate-600 font-medium hover:text-white text-center mb-4 block" onclick="smoothScroll(event, '#n_linked')">Data Not Linked to You</a>
        <a href="#n_collected" className="text-md text-slate-600 font-medium hover:text-white text-center mb-32 block" onclick="smoothScroll(event, '#n_collected')">Data Not Collected</a>
      </div>


      <div id="track" class="min-h-screen flex items-center justify-center">
        <h1 class="text-3xl">Data Used to Track You</h1>
        <p className="text-lg text-slate-600 justify-center font-medium text-center mb-4">Data collected may be used to track users across apps and websites owned by other companies, including sharing data with third-party advertising networks and data brokers.</p>
      </div>

      <div id="linked" class="min-h-screen items-center justify-center">
        <h1 class="text-3xl block">Data Linked to You</h1>
        <p className="text-lg text-slate-600 justify-center font-medium text-center mb-4">Data is collected and is linked to the user’s identity.</p>
      </div>
      
      <div id="n_linked" class="min-h-screen items-center justify-center">
        <h1 class="text-3xl block">Data Not Linked to You</h1>
        <p className="text-lg text-slate-600 font-medium text-center mb-4">Data is collected but is de-identified or anonymized and is therefore not linked to the user’s identity.</p>
      </div>
      
      <div id="n_collected" class="min-h-screen flex items-center justify-center">
        <h1 class="text-3xl">Data Not Collected</h1>
        <p className="text-lg text-slate-600 font-medium text-center mb-4">When an app adds a label with the Data Not Collected Privacy Type, it states that it does not collect any data from the user, and therefore does not include other Privacy Types.</p>
      </div>

      
    </div>
      
  );
}
