import { Link } from '@remix-run/react';

export default function RecentlyChanged({ cacheList }: { cacheList: Record<string, { app_id: string; app_name: string; image_url: string; }> }) {
    return (
        <div>
            <h1>Apps With Recent Changes</h1>
            <ul className='overflow-y-scroll h-96'>
                {Object.entries(cacheList).map(([key, app]) => (
                    <li key={app.app_id} className="border-b">
                        <Link 
                            to={`/app/${app.app_id}`} 
                            className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-md transition duration-200"
                        >
                            <img 
                                className="w-12 h-12 rounded-xl" 
                                src={app.image_url} 
                                alt={app.app_name} 
                            />
                            <strong className="text-blue-600">{app.app_name}</strong> (ID: {app.app_id})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}