import React, { useEffect } from "react";
// import 'shepherd.js/dist/css/shepherd.css';
import Shepherd from 'shepherd.js';

export default function Index() {
  useEffect(() => {
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'shadow-md bg-purple-dark',
        scrollTo: true,
      },
    });

    tour.addStep({
      id: 'track',
      title: 'Data Used to Track You',
      text: 'Data collected may be used to track users across apps and websites owned by other companies, including sharing data with third-party advertising networks and data brokers.',
      attachTo: {
        element: '#track',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Done',
          action: tour.complete,
        },
      ],
    });

    tour.addStep({
      id: 'linked',
      title: 'Data Linked to You',
      text: 'Data is collected and is linked to the user’s identity.',
      attachTo: {
        element: '#linked',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Done',
          action: tour.complete,
        },
      ],
    });

    tour.addStep({
      id: 'n_linked',
      title: 'Data Not Linked to You',
      text: 'Data is collected but is de-identified or anonymized and is therefore not linked to the user’s identity.',
      attachTo: {
        element: '#n_linked',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Done',
          action: tour.complete,
        },
      ],
    });

    tour.addStep({
      id: 'n_collected',
      title: 'Data Not Collected',
      text: 'When an app adds a label with the Data Not Collected Privacy Type, it states that it does not collect any data from the user, and therefore does not include other Privacy Types.',
      attachTo: {
        element: '#n_collected',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Done',
          action: tour.complete,
        },
      ],
    });

    document.querySelectorAll('a[data-tour-step]').forEach(element => {
      element.addEventListener('click', (event) => {
        event.preventDefault();
        const stepId = element.getAttribute('data-tour-step');
        if (stepId) {
          tour.show(stepId);
        }
      });
    });

  }, []);

  return (
    <div id="main-text">
      <style jsx>
        {`
        .shepherd-theme-arrows .shepherd-element {
          --shepherd-primary: #6C63FF;
          --shepherd-text-color: #FFFFFF;
          --shepherd-background: #574BFF;
          --shepherd-border-radius: 20px; /* More rounded corners */
          --shepherd-padding: 20px;
          --shepherd-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .shepherd-button {
          background-color: var(--shepherd-primary);
          color: #574BFF;
          border: none;
          padding: 8px 16px;
          border-radius: 20px; /* More rounded corners for buttons */
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .shepherd-button:hover {
          background-color: #574BFF;
        }
      `}
    </style>

      <div className="mb-20">
        <h1 className="text-4xl font-semibold mb-16 text-center">GWU SEC Privacy Label Observatory Dashboard</h1>
        <h2 className="text-lg text-white-700 mb-4 text-center">
          We collected nearly weekly snapshots of the privacy labels of 1.6+ million apps over the span of a year. Explore our database:
        </h2>
        <div className="flex justify-center items-center space-x-4">
          <button className="px-4 py-1 text-lg font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">the Apps</button>
          <button className="px-4 py-1 text-lg font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">the Graphs</button>
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
        <a data-tour-step="track" className="text-md text-slate-600 font-medium hover:text-white text-center mb-4 block">Data Used to Track You</a>
        <a data-tour-step="linked" className="text-md text-slate-600 font-medium hover:text-white text-center mb-4 block">Data Linked to You</a>
        <a data-tour-step="n_linked" className="text-md text-slate-600 font-medium hover:text-white text-center mb-4 block">Data Not Linked to You</a>
        <a data-tour-step="n_collected" className="text-md text-slate-600 font-medium hover:text-white text-center mb-32 block">Data Not Collected</a>
      </div>

    </div>
  );
}
