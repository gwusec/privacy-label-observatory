import React from 'react';

export default function Index() {

  return (
    <div id="main-text">
      <div className="mb-14">
        <h1 className="text-4xl font-semibold mb-16 text-center">GWU SEC Privacy Label Observatory Wiki</h1>
        <p className="text-xl text-white-700 mb-4 text-center">
          After 2021, Apple Store required apps updating or being put on the app store for the first time to specify privacy labels.
        </p>
        <h2 className="text-xl text-white-700 mb-10 text-center">
          We collected nearly weekly snapshots of the privacy labels of 1.6+ million apps over the span of a year.
        </h2>
        <h1 className="text-4xl text-white-700 text-center mb-8 font-semibold">Here is what we found:</h1>
      </div>
      <div className="mb-20">
        <div>
          <h2 className="text-2xl text-white-600 mb-4 font-bold">
            Voluntary Update vs. Means to an End:
          </h2>
          <p className="text-lg mb-4">
            The increase from 2021 to 2022 is mainly in new apps which are being published, where the privacy label is just an obstacle to the goal of adding an app to the app store.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <p className="text-lg text-white-600 mb-8 max-w-sm items-center space-x-4 pl-16">
              Our research found that existing apps that voluntarily updated their privacy labels -- without a version update -- included more details about their data collection practices.
            </p>
            <p className="text-lg text-white-600 mb-8 max-w-sm items-center space-x-4 pl-16">
              50% of older apps that added a label with a version update simply stated they don’t collect any data.
            </p>
            <p className="text-lg text-white-600 mb-8 max-w-sm items-center space-x-4 pl-16 font-semibold">
              This implies more truthfulness in the apps which voluntarily updated their labels.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl text-white-600 mb-4 font-bold">
            You get what you do (or don't) pay for:
          </h2>
          <p className="text-lg text-white-700 pl-16 mb-8">
            When comparing paid vs. free apps, more free apps report data collection and tracking than those you pay for, perhaps reflecting additional revenue streams from free apps in targeted advertising and/or selling user data.
          </p>
          <h3 className="text-xl text-white-600 mb-4 pl-16 font-bold">
            Data collection in popular free apps:
          </h3>
          <p className="text-lg text-white-700 pl-32 mb-16">
            The large audience increases the surveillance surplus, which may make it harder for app sellers to resist collecting a wider range of data to increase profits. Therefore, popular apps reflect more data collection compared to less popular apps.
          </p>
        </div>
        <div>
          <h2 className="text-2xl text-white-600 mb-4 font-bold">
            Data collection may have no boundaries:
          </h2>
          <p className="text-lg text-white-700 mb-16 pl-16">
            Many apps with a 4+ or 9+ content rating report tracking data and would be available to children under the content rating guidelines, implying that they are tracking the data of children.
          </p>
        </div>
        <div>
          <h2 className="text-2xl text-white-600 mb-4 font-bold">
            Larger sized apps:
          </h2>
          <p className="text-lg text-white-700 mb-16 pl-16">
            According to the privacy labels, larger apps collect and track more user data. This may be due to the fact that apps with larger footprints contain additional software libraries for the purpose of collecting data.
          </p>
        </div>
      </div>
    </div>
  );
}
