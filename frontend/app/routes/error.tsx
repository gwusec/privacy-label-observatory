import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{
    title: "Error",
  }];
};

export default function error(){
    return(
        <div className="h-screen text-center">
            <h1>Sorry, we couldn't find that page. </h1>
        </div>
    )
}