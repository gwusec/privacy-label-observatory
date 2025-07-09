import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import AppDetail from "~/components/AppDetail";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if (!data || data.length === 0) {
        return [{
            title: "App Not Found",
        }];
    }

    const appName = data[1][0]['app_name'];
    return [{
        title: `Explorer - ${appName}`,
    }];
};

export async function loader({ params }: LoaderFunctionArgs) {

    // First, get dates
    const dates = await fetch(process.env.BACKEND_API + "dates");
    const datesJson = await dates.json();

    // Then, get app
    const q = params.app_id
    if (!q || q == undefined || isNaN(Number(q))) {
        return redirect("/error")
    }

    const app = await fetch(process.env.BACKEND_API + "fullApp?id=" + q)
    const data = await app.json()

    // Redirect if it's an error or empty response 
    const isEmptyPrivacyOnly = Array.isArray(data) && data.length === 1 && Array.isArray(data[0].privacy) && data[0].privacy.length === 0;

    if (data?.error || isEmptyPrivacyOnly) {
        return redirect("/error");
    }

    return [datesJson, data];
};

export default function searchApp() {
    const data = useLoaderData<typeof loader>();
    const app = data[1];
    const dates = data[0];

    // Search for a non-empty privacy index (determines if the horizontal timeline should be displayed)
    const firstNonEmptyPrivacyIndex = app[1].privacy?.findIndex(
        (privacy: any) =>
            privacy.privacy_types.privacyDetails.privacyTypes &&
            privacy.privacy_types.privacyDetails.privacyTypes.length > 0 &&
            privacy.privacy_types.privacyDetails.privacyTypes.some(
                (type: any) => type.dataCategories.length > 0 || type.purposes.length > 0
            )
    );

    return (
        <div className={`items-start h-full`}>
            <AppDetail data={app} dates={dates} firstIndex={firstNonEmptyPrivacyIndex} />
        </div>
    );
}