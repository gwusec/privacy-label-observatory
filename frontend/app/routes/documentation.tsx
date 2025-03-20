import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useNavigation } from '@remix-run/react';
import { FaSpinner } from 'react-icons/fa';

const Index: React.FC = () => {
  const { state } = useNavigation();
  const { theme } = useTheme();

  return (
    <>
      {state === 'loading' ?
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin" size={72} />
        </div>
        :
        <div className={` min-h-screen flex`}>
          <div id="main-text">
            <div className="">
              <h1 className={`text-4xl font-bold mb-16 text-center ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
                GWUSEC Privacy Label Observatory Wiki
              </h1>
              <p className="text-xl text-white-700 mb-4 text-center">
                After 2021, Apple Store required apps updating or being put on the app store for the first time to specify privacy labels. The various choices made by developers of apps are reflected here, whether it be underreporting data or reporting well, and the reasons behind each.
              </p>
              <h2 className="text-xl text-white-700 mb-4 text-center">
                We collected snapshots of the privacy labels of 1.6+ million apps.
              </h2>
              <h2 className="text-xl text-center">
                Initially, these runs were collected once a week. However, once sufficient data had been collected, the data has been scraped at a monthly pace.
              </h2>
            </div>

            <div className='pt-10'>
              <h1 className="text-3xl pb-4 font-bold text-center">
                How to Use this Website
              </h1>
              <h2 className='text-xl pb-2 text-center'>
                <strong>Dashboard</strong>: As the name states, it's a dashboard for all statistical data that has been done on the apps that have been collected from the Apple Store, from longitudinal data to more specific distinctions across categories.
              </h2>
              <h2 className='text-xl pb-2 text-center'>
                <strong>Search</strong>: At your perusal, feel free to search our database of apps that we've collected. View the privacy data of your app in a new way, or select apps that other users are searching for.
              </h2>
              <h2 className='text-xl pb-10 text-center'>
                <strong>App</strong>: Once you find the app that you would like to view, choose to either view a condensed view of data that your app has access to, or expand to view extensive details about what permissions your app has access to. Additionally, travel through the history of the app and view what permissions have changed over time.
              </h2>
            </div>



            <div className="mb-16 relative">
              <h1 className={`text-3xl mb-8 text-white-700 text-center font-bold ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>But what are privacy labels?</h1>
              <p className="text-lg text-white-300 font-medium text-center mb-4">Privacy labels are basically nutrition labels, where the app must indicate what data is collected and used compactly.</p>

              <a className={`text-lg font-medium text-center mb-4 block relative ${theme === 'dark' ? 'text-dred' : 'text-black'}`}>
                Data Used to Track You
                <strong className="block text-md text-gray mt-1">
                  Data collected may be used to track users across apps and websites owned by other companies, including sharing data with third-party advertising networks and data brokers.
                </strong>
              </a>

              <a className={`text-lg font-medium text-center mb-4 block relative ${theme === 'dark' ? 'text-dred' : 'text-black'}`}>
                Data Linked to You
                <strong className="block text-md text-gray mt-1">
                  Data is collected and is linked to the user’s identity.
                </strong>
              </a>

              <a className={`text-lg font-medium text-center mb-4 block relative ${theme === 'dark' ? 'text-dred' : 'text-black'}`}>
                Data Not Linked to You
                <strong className="block text-md text-gray mt-1">
                  Data is collected but is de-identified or anonymized and is therefore not linked to the user’s identity.
                </strong>
              </a>

              <a className={`text-lg cursor-pointer font-medium text-center mb-32 block relative ${theme === 'dark' ? 'text-dred' : 'text-black'}`}>
                Data Not Collected
                <strong className="block text-md text-gray mt-1">
                  When an app has a label with the Data Not Collected Privacy Type, it implies that it does not collect any data from the user, and therefore does not include other Privacy Types.
                </strong>
              </a>
            </div>
            <div className='pb-20'>
              <h1 className={`text-3xl mb-8 text-white-700 text-center font-bold ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
                Apple's Data Categories
              </h1>

              {/* Contact Info */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Contact Info</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Name:</strong> Such as first or last name
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Email Address:</strong> Including but not limited to a hashed email address
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Phone Number:</strong> Including but not limited to a hashed phone number
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Physical Address:</strong> Such as home address, physical address, or mailing address
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Other User Contact Info:</strong> Any other information that can be used to contact the user outside the app
                  </li>
                </ul>
              </details>

              {/* Health & Fitness */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Health & Fitness</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Health:</strong> Health and medical data, including but not limited to data from the Clinical Health Records API, HealthKit API, Movement Disorder API, or health-related human subject research or any other user-provided health or medical data
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Fitness:</strong> Fitness and exercise data, including but not limited to the Motion and Fitness API
                  </li>
                </ul>
              </details>

              {/* Financial Info */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Financial Info</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Payment Info:</strong> Such as form of payment, payment card number, or bank account number. If your app uses a payment service, the payment information is entered outside your app, and you as the developer never have access to the payment information, it is not collected and does not need to be disclosed.
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Credit Info:</strong> Such as credit score
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Other Financial Info:</strong> Such as salary, income, assets, debts, or any other financial information
                  </li>
                </ul>
              </details>

              {/* Location */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Location</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Precise Location:</strong> Information that describes the location of a user or device with the same or greater resolution as a latitude and longitude with three or more decimal places
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Coarse Location:</strong> Information that describes the location of a user or device with lower resolution than a latitude and longitude with three or more decimal places, such as Approximate Location Services
                  </li>
                </ul>
              </details>

              {/* Sensitive Info */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Sensitive Info</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Sensitive Info:</strong> Information that describes the location of a user or device with the same or greater resolution as a latitude and longitude with three or more decimal places
                  </li>
                </ul>
              </details>

              {/* Contacts */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Contacts</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Contacts:</strong> Such as a list of contacts in the user’s phone, address book, or social graph
                  </li>
                </ul>
              </details>

              {/* User Content */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">User Content</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Emails or Text Messages:</strong> Including subject line, sender, recipients, and contents of the email or message
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Photos or Videos:</strong> The user’s photos or videos
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Audio Data:</strong> The user’s voice or sound recordings
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Gameplay Content:</strong> Such as saved games, multiplayer matching or gameplay logic, or user-generated content in-game
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Customer Support:</strong> Data generated by the user during a customer support request
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Other User Content:</strong> Any other user-generated content
                  </li>
                </ul>
              </details>

              {/* Browsing History */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Browsing History</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Browsing History:</strong>Information about content the user has viewed that is not part of the app, such as websites
                  </li>
                </ul>
              </details>

              {/* Search History */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Search History</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Search History:</strong> 	Information about searches performed in the app
                  </li>
                </ul>
              </details>

              {/* Identifiers */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Identifiers</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>User ID:</strong> Such as screen name, handle, account ID, assigned user ID, customer number, or other user- or account-level ID that can be used to identify a particular user or account
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Device ID:</strong> Such as the device’s advertising identifier, or other device-level ID
                  </li>
                </ul>
              </details>

              {/* Purchases */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Purchases</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Purchase History:</strong> An account’s or individual’s purchases or purchase tendencies
                  </li>
                </ul>
              </details>

              {/* Usage Data */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Usage Data</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Product Interaction:</strong> Such as app launches, taps, clicks, scrolling information, music listening data, video views, saved place in a game, video, or song, or other information about how the user interacts with the app
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Advertising Data:</strong> Such as information about the advertisements the user has seen
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Other Usage Data:</strong> Any other data about user activity in the app
                  </li>
                </ul>
              </details>

              {/* Diagnostics */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Diagnostics</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Crash Data:</strong> Such as crash logs
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Performance Data:</strong> 	Such as launch time, hang rate, or energy use
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Other Diagnostic Data:</strong> Any other data collected for the purposes of measuring technical diagnostics related to the app
                  </li>
                </ul>
              </details>

              {/* Surroundings */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Surroundings</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Environment Scanning:</strong> Such as mesh, planes, scene classification, and/or image detection of the user’s surroundings
                  </li>
                </ul>
              </details>

              {/* Body */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Body</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Hands:</strong> 	The user’s hand structure and hand movements
                  </li>
                  <li className="border-b border-gray-200 py-2">
                    <strong>Head:</strong> 	The user’s head movement
                  </li>
                </ul>
              </details>

              {/* Other Data */}
              <details className="border rounded-lg p-4 mb-4" open>
                <summary className="font-semibold cursor-pointer text-lg">Other Data</summary>
                <ul className="mt-2 space-y-2">
                  <li className="border-b border-gray-200 py-2">
                    <strong>Other Data Types:</strong> Any other data types not mentioned
                  </li>
                </ul>
              </details>

            </div>
          </div>

        </div>
      }
    </>
  );
};


export default Index;

