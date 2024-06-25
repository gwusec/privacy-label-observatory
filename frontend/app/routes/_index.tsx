import useEffect from 'react';
import { useTheme } from "next-themes";
import React, { useRef } from 'react';

const Index: React.FC = () => {
  const { theme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (direction: 'prev' | 'next') => {
    const container = scrollContainerRef.current;
    if (!container) {
      console.error('Scroll container not found');
      return;
    }

    const scrollAmount = direction === 'prev' ? -container.offsetWidth : container.offsetWidth;
    console.log('Scroll amount:', scrollAmount);

    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    console.log('Scrolling:', direction);
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div id="main-text">
        <div className="mb-14">
          <h1 className={`text-4xl font-bold mb-16 text-center text-dred`}>GWUSEC Privacy Label Observatory Wiki</h1>
          <p className="text-xl text-white-700 mb-4 text-center">
            After 2021, Apple Store required apps updating or being put on the app store for the first time to specify privacy labels.
          </p>
          <h2 className="text-xl text-white-700 mb-20 text-center">
            We collected nearly weekly snapshots of the privacy labels of 1.6+ million apps over the span of a year.
          </h2>
          <h1 className={`text-4xl text-white-700 text-center font-semibold text-dred`}>Here is what we found:</h1>
        </div>
        <div ref={scrollContainerRef} className="w-full snap-x snap-mandatory flex h-screen space-x-80 overflow-hidden">
          {/* <div className="flex space-x-8"> */}
          <div className="snap-start flex-shrink-0 w-3/4 h-screen flex items-center justify-center">
            <h2 className={`text-2xl text-white-600 mb-10 font-bold scroll space-x-16 ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
              Voluntary Update vs. Means to an End:
            </h2>
            <div className="flex flex-col items-end space-y-4">
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
            {/* </div> */}
          </div>
          <div className="snap-start flex-shrink-0 w-3/4  flex items-start justify-center space-x-32 pl-40">
            <div className="flex flex-col items-end space-y-4">
              <h2 className={`text-xl text-white-600 font-bold  text-justify items-start ${theme === 'dark' ? 'text-dred' : 'text-dred'}`}>
                You get what you do (or don't) pay for:
              </h2>
              <p className="text-lg text-white-700 pl-10 text-justify max-w-md">
                When comparing paid vs. free apps, more free apps report data collection and tracking than those you pay for, perhaps reflecting additional revenue streams from free apps in targeted advertising and/or selling user data.
              </p>
            </div>
            <div className="flex flex-col items-end space-y-4">
              <h3 className={`text-xl text-white-600 font-bold text-justify items-start ${theme === 'dark' ? 'text-dred' : 'text-dred'}`}>
                Data collection in popular free apps:
              </h3>
              <p className="text-lg text-white-700 pl-10 items-center text-justify max-w-md">
                The large audience increases the surveillance surplus, which may make it harder for app sellers to resist collecting a wider range of data to increase profits. Therefore, popular apps reflect more data collection compared to less popular apps.
              </p>
            </div>
          </div>
          <div className="snap-start flex-shrink-0  flex items-start justify-center pl-20">
            <h2 className={`text-2xl text-white-600 mb-10 font-bold space-x-16 ${theme === 'dark' ? 'text-dred' : 'text-red'}`}>
              Data collection may have no boundaries:
            </h2>
            <p className="text-lg text-white-700 mb-16 text-justify pl-16 max-w-md">
              Many apps with a 4+ or 9+ content rating report tracking data and would be available to children under the content rating guidelines, implying that they are tracking the data of children.
            </p>
          </div>
          <div className="snap-start flex-shrink-0 w-3/4  flex items-start justify-start">
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
      </div>
      <button
        className={`absolute left-0 top-3/4 transform -translate-y-1/2 text-gray-700 rounded-full p-4 shadow-md ${theme === 'dark' ? 'text-red hover:text-red hover:bg-grey' : 'text-red hover:text-white hover:bg-red'}`}
        style={{ fontSize: '1.5rem', padding: '1.5rem' }}
        onClick={() => scrollTo('prev')}
      >
        &lt;
      </button>
      <button
        className={`absolute right-0 top-3/4 transform -translate-y-1/2 text-gray-700 rounded-full p-4 shadow-md ${theme === 'dark' ? 'text-red hover:text-red hover:bg-grey' : 'text-red hover:text-white hover:bg-red'}`}
        style={{ fontSize: '1.5rem', padding: '1.5rem' }}
        onClick={() => scrollTo('next')}
      >
        &gt;
      </button>
    </div>
  );
};


export default Index;

