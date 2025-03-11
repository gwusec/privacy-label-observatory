import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { FaSpinner } from "react-icons/fa";
import { useNavigation } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import DownloadButton from "~/components/DownloadButton";

export const meta: MetaFunction = () => {
    return [{
        title: "API",
    }];
};

// export async function loader({ params }: LoaderFunctionArgs) {
//     const q = params.app_id
//     if (q == undefined) {
//         return
//     }

//     const app = await fetch(process.env.BACKEND_API + "fullApp?id=" + q)
//     const data = await app.json()
//     return (json(data));
// };

export default function API() {
    const { theme } = useTheme();
    const { state } = useNavigation()


    return (
        <div className="min-h-screen h-full">
            <div>
                <h1>THIS PAGE IS STILL A WIP!</h1>
            </div>
            <div className="flex flex-col items-center space-y-4">
                <h1 className="text-xl font-bold">Download JSON Data</h1>
                <DownloadButton index="run_00001" />
                <DownloadButton index="run_00002" />
                <DownloadButton index="run_00003" />
            </div>
        </div>
    )

}