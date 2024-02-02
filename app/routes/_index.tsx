import type { MetaFunction } from "@remix-run/node";
import { LoremIpsum } from "react-lorem-ipsum";

export const meta: MetaFunction = () => {
  return [
    { title: "Privacy Label Observatory" },
    { name: "description", content: "Welcome  Remix!" },
  ];
};

export default function Index() {
  return (
    <div class="container mx-auto space-y-4">
      <h1> Privacy Label Observatory</h1>
      <LoremIpsum
        p={5}
      />
    </div>
  );
}
