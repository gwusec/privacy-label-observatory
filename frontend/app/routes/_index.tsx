import { LoremIpsum } from "react-lorem-ipsum";
import { Navigation, useNavigation } from "@remix-run/react";

export default function Index() {
  const navigation = useNavigation()
  return (
    <>
    {navigation.state === 'loading' ? <h1>Loading...</h1> : 
    <div id="main-text" >
      <h1> Privacy Label Observatory</h1>
      <LoremIpsum
        p={5}
      />
    </div>
    }
    </>
  );
}
