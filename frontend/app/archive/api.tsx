import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { useNavigation } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/dropdown";
import { json } from "@remix-run/node";
import DownloadButton from "~/archive/DownloadButton";

export const meta: MetaFunction = () => {
    return [{
        title: "API",
    }];
};

export async function loader({ params }: LoaderFunctionArgs) {
    const app = await fetch(process.env.BACKEND_API + "api/runs")
    const data = await app.json()
    return (json(data));
};

export default function API() {
    const { theme } = useTheme();
    const { state } = useNavigation()
    const data = useLoaderData<typeof loader>();
    
    // State to track the selected run
    const [selectedRun, setSelectedRun] = useState<string | null>(null);

    const handleRunSelect = (run:string) => {
        setSelectedRun(run);
    }

    const handleDownload = () => {
        const url = `http://localhost:8017/download/${selectedRun}`; // Adjust this if your server URL is different
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${selectedRun}.json`); // Set filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      return (
        <div className="min-h-screen h-full flex flex-col items-center space-y-4">
            <h1 className="text-xl font-bold">Download JSON Data</h1>

            {/* Dropdown for selecting a run */}
            <Dropdown>
                <DropdownTrigger>
                    <button className={`px-4 py-2 ${theme === 'dark' ? 'text-white border-2 border-white bg-black' : 'text-black border-2 border-black bg-white'} rounded-lg`}>
                        {selectedRun ? `Run: ${selectedRun}` : "Select a Run"}
                    </button>
                </DropdownTrigger>
                <DropdownMenu className="max-h-64 overflow-y-auto" aria-label="Runs List">
                    {data.map((run: string, index: number) => (
                        <DropdownItem key={index} onClick={() => handleRunSelect(run)}>
                            {run}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>

            {/* Download Button - Visible only when a run is selected */}
            {selectedRun && (
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                    Download {selectedRun}
                </button>
            )}
        </div>
    );

}