import { LoremIpsum } from "react-lorem-ipsum";

export default function Index() {
    return (
    <div id="main-text" >
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Dashboard</h1>
      <h2 className="text-lg text-white-700 mb-4">
        We collected nearly weekly snapshots of the privacy labels of 1.6+ million apps over the span of a year. Here is what we found:
      </h2>
      <p className="text-lg text-white-700">
        The amount of apps that have privacy labels increased by 28% during the measurement period, from 42% in 2021 to 72% in 2022.
      </p>
      <p className="text-lg text-white-700">
        After 2021, Apple Store required apps updating or being put on the app store for the first time to specify privacy labels. The increase from 2021 to 2022 is mainly in new apps which are being published, where the privacy label is just an obstacle to the goal of adding an app to the app store.
        Our research found that existing apps that voluntarily updated their privacy labels -- without a version update--- included more details about their data collection pracitves.
        This compared to the 50% of older apps that added a label with a version update simply stating they don’t collect any data, implies more truthfullness in the apps which volunarily updated their labels.
      </p>
      <img class="h-auto max-w-full” src="/home/ilincah/pl-observation-sample/frontend/app/resources/version_update.png” alt="image description”></img>
      <p className="text-lg text-white-700">
        When these apps do change their labels, they tend to change them to reflect more data collection.
      </p>
      <p className="text-lg text-white-700">
        According to the privacy labels, larger apps collect and track more user data. This may be due to the fact that apps with larger footprints contain additional software libraries for this purpose.
      </p>
      <p className="text-lg text-white-700">
        According to the privacy labels, larger apps collect and track more user data. This may be due to the fact that apps with larger footprints contain additional software libraries for this purpose.
      </p>
    </div >
  );
}
