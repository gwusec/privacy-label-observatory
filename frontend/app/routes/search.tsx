import { LoremIpsum } from "react-lorem-ipsum";

export default function Index() {
  return (
    <div id="main-text" className="h-screen" >
      <h1> Documentation</h1>
      <LoremIpsum
        p={5}
      />
    </div>
  );
}
