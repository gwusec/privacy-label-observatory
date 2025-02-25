import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import Timeline from '~/components/Timeline';
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if (!data || data.length === 0) {
        return [{
            title: "App Not Found",
        }];
    }

    const appName = data[0]['app_name'];
    return [{
        title: `Explorer - ${appName}`,
    }];
};

export async function loader({ params }: LoaderFunctionArgs) {
    const q = params.app_id
    if (q == undefined) {
        return
    }

    const app = await fetch(process.env.BACKEND_API + "fullApp?id=" + q)
    const data = await app.json()
    return (json(data));
};

export default function searchApp() {

    const data = useLoaderData<typeof loader>();
    return (
        <div className={`items-start min-h-screen h-full`}>
            <Timeline data={data} />
        </div>
    )
}