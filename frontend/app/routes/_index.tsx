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
        <div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/4">
          <FaSpinner className="animate-spin" size={72} />
        </div>
      :
        <div className={`${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'} min-h-screen flex`}>
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
            <div ref={scrollContainerRef} className="w-full snap-x snap-mandatory flex space-x-80 overflow-hidden mb-16">
              <div className="snap-start flex-shrink-0 w-3/4 flex items-start justify-center">
                <h2 className={`text-2xl text-white-600 mb-10 font-bold scroll space-x-16 ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
                  Voluntary Update vs. Means to an End:
                </h2>
                <div className="items-start">
                  <p className="text-lg text-white-600 mb-8 max-w-md items-start text-justify space-x-4 pl-16">
                    The increase from 2021 to 2022 is mainly in new apps which are being published, where the privacy label is just an obstacle to the goal of adding an app to the app store.
                  </p>
                  <p className="text-lg text-white-600 mb-8 max-w-md items-start text-justify space-x-4 pl-16">
                    Our research found that existing apps that voluntarily updated their privacy labels -- without a version update -- included more details about their data collection practices.
                  </p>
                  <p className="text-lg text-white-600 mb-8 max-w-md items-start text-justify space-x-4 pl-16">
                    50% of older apps that added a label with a version update simply stated they don’t collect any data.
                  </p>
                  <p className="text-lg text-white-600 mb-8 max-w-md text-justify font-semibold">
                    This implies more truthfulness in the apps which voluntarily updated their labels.
                  </p>
                </div>
              </div>
              <div className="snap-start flex-shrink-0 w-3/4 flex items-center justify-center space-x-32 pl-40">
                <div className="flex flex-col items-end space-y-4 mb-5">
                  <h2 className={`text-2xl text-white-600 font-bold text-justify items-start ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
                    You get what you do (or don't) pay for:
                  </h2>
                  <p className="text-lg text-white-700 pl-10 text-justify max-w-md">
                    When comparing paid vs. free apps, more free apps report data collection and tracking than those you pay for, perhaps reflecting additional revenue streams from free apps in targeted advertising and/or selling user data.
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-4">
                  <h3 className={`text-2xl text-white-600 font-bold text-justify items-start ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
                    Data collection in popular free apps:
                  </h3>
                  <p className="text-lg text-white-700 pl-10 text-justify max-w-md">
                    The large audience increases the surveillance surplus, which may make it harder for app sellers to resist collecting a wider range of data to increase profits. Therefore, popular apps reflect more data collection compared to less popular apps.
                  </p>
                </div>
              </div>
              <div className="snap-start flex-shrink-0 flex items-center justify-center pl-20">
                <h2 className={`text-2xl text-white-600 mb-10 font-bold space-x-16 mb-40 ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
                  Data collection may have no boundaries:
                </h2>
                <p className="text-lg text-white-700 mb-16 text-justify pl-16 max-w-md">
                  Many apps with a 4+ or 9+ content rating report tracking data and would be available to children under the content rating guidelines, implying that they are tracking the data of children.
                </p>
              </div>
              <div className="snap-start flex-shrink-0 w-3/4 flex items-center justify-start">
                <div className="flex flex-col">
                  <h2 className={`text-2xl text-white-600 mb-10 font-bold scroll text-justify ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
                    Larger sized apps:
                  </h2>
                  <p className="text-lg text-white-700 mb-16 text-justify pl-16 max-w-md">
                    According to the privacy labels, larger apps collect and track more user data. This may be due to the fact that apps with larger footprints contain additional software libraries for the purpose of collecting data.
                  </p>
                </div>
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

              <a className={`text-md font-medium text-center mb-4 block relative ${theme === 'dark' ? 'text-dred hover:text-grey' : 'text-red hover:text-white'}`}>
                Data Used to Track You
                <span className="hover-text">Data collected may be used to track users across apps and websites owned by other companies, including sharing data with third-party advertising networks and data brokers.</span>
              </a>

              <a className={`text-md font-medium text-center mb-4 block relative ${theme === 'dark' ? 'text-dred hover:text-grey' : 'text-red hover:text-white'}`}>
                Data Linked to You
                <span className="hover-text">Data is collected and is linked to the user’s identity.</span>
              </a>

              <a className={`text-md font-medium text-center mb-4 block relative ${theme === 'dark' ? 'text-dred hover:text-grey' : 'text-red hover:text-white'}`}>
                Data Not Linked to You
                <span className="hover-text">Data is collected but is de-identified or anonymized and is therefore not linked to the user’s identity.</span>
              </a>

              <a className={`text-md font-medium text-center mb-32 block relative ${theme === 'dark' ? 'text-dred hover:text-grey' : 'text-red hover:text-white'}`}>
                Data Not Collected
                <span className="hover-text">When an app has a label with the Data Not Collected Privacy Type, it implies that it does not collect any data from the user, and therefore does not include other Privacy Types.</span>
              </a>
            </div>

            <style jsx>{`
              .hover-text {
                visibility: hidden;
                opacity: 0;
                width: 300px;
                background-color: #555;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 15px 10px;
                position: absolute;
                z-index: 1;
                bottom: 125%;
                left: 50%;
                margin-left: -150px;
                transition: opacity 0.3s;
              }

              a:hover .hover-text {
                visibility: visible;
                opacity: 1;
              }
            `}</style>

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

