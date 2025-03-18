import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useNavigation } from '@remix-run/react';
import { FaSpinner } from 'react-icons/fa';

const Index: React.FC = () => {
  const { state } = useNavigation();
  const { theme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4; // Update this according to the actual number of pages

  const scrollTo = (direction: 'prev' | 'next') => {
    const container = scrollContainerRef.current;
    if (!container) {
      console.error('Scroll container not found');
      return;
    }

    const scrollAmount = direction === 'prev' ? -container.offsetWidth : container.offsetWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      {state === 'loading' ?
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin" size={72} />
        </div>
        :
        <div className={` min-h-screen flex`}>
          <div id="main-text">
            <div className="mb-14">
              <h1 className={`text-4xl font-bold mb-16 text-center ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
                GWUSEC Privacy Label Observatory Wiki
              </h1>
              <p className="text-xl text-white-700 mb-4 text-center">
                After 2021, Apple Store required apps updating or being put on the app store for the first time to specify privacy labels.
              </p>
              <h2 className="text-xl text-white-700 mb-20 text-center">
                We collected nearly weekly snapshots of the privacy labels of 1.6+ million apps over the span of a year.
              </h2>
              <h1 className={`text-4xl text-white-700 text-center font-semibold ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
                Here is what we found:
              </h1>
            </div>
            <div ref={scrollContainerRef} className="w-full snap-x snap-mandatory flex overflow-x-hidden space-x-16 overflow-hidden mb-16">
              {/* Card 1 */}
              <div className={`snap-center flex-shrink-0 w-full rounded-3xl min-w-full h-[80vh] flex flex-col items-start justify-center p-10`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Voluntary Update vs. Means to an End:
                </h2>
                <div>
                  <p className={`text-lg text-gray-${theme === 'dark' ? '200' : '800'} mb-4 text-justify`}>
                    The increase from 2021 to 2022 is mainly in new apps which are being published, where the privacy label is just an obstacle to the goal of adding an app to the app store.
                  </p>
                  <p className={`text-lg text-gray-${theme === 'dark' ? '200' : '800'} mb-4 text-justify`}>
                    Our research found that existing apps that voluntarily updated their privacy labels -- without a version update -- included more details about their data collection practices.
                  </p>
                  <p className={`text-lg text-gray-${theme === 'dark' ? '200' : '800'} mb-4 text-justify`}>
                    50% of older apps that added a label with a version update simply stated they don’t collect any data.
                  </p>
                  <p className={`text-lg text-gray-${theme === 'dark' ? '200' : '800'} font-semibold text-justify`}>
                    This implies more truthfulness in the apps which voluntarily updated their labels.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className={`snap-center flex-shrink-0 w-full rounded-3xl min-w-full h-[80vh] flex flex-col items-start justify-center p-10`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  You get what you do (or don't) pay for:
                </h2>
                <p className={`text-lg text-gray-${theme === 'dark' ? '200' : '800'} text-justify max-w-lg`}>
                  When comparing paid vs. free apps, more free apps report data collection and tracking than those you pay for, perhaps reflecting additional revenue streams from free apps in targeted advertising and/or selling user data.
                </p>
                <h3 className={`text-2xl font-bold mt-8 mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Data collection in popular free apps:
                </h3>
                <p className={`text-lg text-gray-${theme === 'dark' ? '200' : '800'} text-justify max-w-lg`}>
                  The large audience increases the surveillance surplus, which may make it harder for app sellers to resist collecting a wider range of data to increase profits. Therefore, popular apps reflect more data collection compared to less popular apps.
                </p>
              </div>

              {/* Card 3 */}
              <div className={`snap-center flex-shrink-0 w-full rounded-3xl min-w-full h-[80vh] flex flex-col bg-gray-items-start justify-center p-10`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Data collection may have no boundaries:
                </h2>
                <p className={`text-lg text-gray-${theme === 'dark' ? '200' : '800'} text-justify max-w-md`}>
                  Many apps with a 4+ or 9+ content rating report tracking data and would be available to children under the content rating guidelines, implying that they are tracking the data of children.
                </p>
              </div>

              {/* Card 4 */}
              <div className={`snap-center flex-shrink-0 w-full rounded-3xl min-w-full h-[80vh] flex flex-col items-start justify-center p-10`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Larger sized apps:
                </h2>
                <p className={`text-lg text-gray-${theme === 'dark' ? '200' : '800'} text-justify max-w-md`}>
                  According to the privacy labels, larger apps collect and track more user data. This may be due to the fact that apps with larger footprints contain additional software libraries for the purpose of collecting data.
                </p>
              </div>
            </div>


            <div className="flex justify-center items-center mb-8">
              <span className={`text-xl ${theme === 'dark' ? 'text-white-700' : 'text-gray-700'}`}>
                {currentPage}/{totalPages}
              </span>
            </div>
            <div className="mt-40">
              <p className="text-lg text-white-700 mb-16 mt-32 text-center">
                After 2021, Apple Store required apps updating or being put on the app store for the first time to specify privacy labels. The various choices made by developers of apps are reflected here, whether it be underreporting data or reporting well, and the reasons behind each.
              </p>
            </div>
            <div className="mb-16 relative">
              <h1 className={`text-3xl mb-8 text-white-700 text-center font-bold ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>But what are privacy labels?</h1>
              <p className="text-lg text-white-300 font-medium text-center mb-4">Privacy labels are basically nutrition labels, where the app must indicate what data is collected and used compactly.</p>

              <a className={`text-md cursor-pointer font-medium text-center mb-4 block relative ${theme === 'dark' ? 'text-dred' : 'text-black'}`}>
                Data Used to Track You
                <strong className="block text-sm text-gray mt-1">
                  Data collected may be used to track users across apps and websites owned by other companies, including sharing data with third-party advertising networks and data brokers.
                </strong>
              </a>

              <a className={`text-md cursor-pointer font-medium text-center mb-4 block relative ${theme === 'dark' ? 'text-dred' : 'text-black'}`}>
                Data Linked to You
                <strong className="block text-sm text-gray mt-1">
                  Data is collected and is linked to the user’s identity.
                </strong>
              </a>

              <a className={`text-md cursor-pointer font-medium text-center mb-4 block relative ${theme === 'dark' ? 'text-dred' : 'text-black'}`}>
                Data Not Linked to You
                <strong className="block text-sm text-gray mt-1">
                  Data is collected but is de-identified or anonymized and is therefore not linked to the user’s identity.
                </strong>
              </a>

              <a className={`text-md cursor-pointer font-medium text-center mb-32 block relative ${theme === 'dark' ? 'text-dred' : 'text-black'}`}>
                Data Not Collected
                <strong className="block text-sm text-gray mt-1">
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
          <button
            className={`absolute left-0 top-3/4 transform -translate-y-1/2 text-gray-700 rounded-full p-4 shadow-md ${theme === 'dark' ? 'text-white bg-grey hover:text-red hover:bg-white' : 'text-red hover:text-white hover:bg-red'}`}
            style={{ fontSize: '1.5rem', padding: '1.5rem' }}
            onClick={() => scrollTo('prev')}
          >
            &lt;
          </button>
          <button
            className={`absolute right-0 top-3/4 transform -translate-y-1/2 text-gray-700 rounded-full p-4 shadow-md ${theme === 'dark' ? 'text-white bg-grey hover:text-red hover:bg-white' : 'text-red hover:text-white hover:bg-red'}`}
            style={{ fontSize: '1.5rem', padding: '1.5rem' }}
            onClick={() => scrollTo('next')}
          >
            &gt;
          </button>
        </div>
      }
    </>
  );
};


export default Index;

