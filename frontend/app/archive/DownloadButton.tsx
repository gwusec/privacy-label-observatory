import { useTheme } from 'next-themes';
import React from 'react';

interface DownloadButtonProps {
  index: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ index }) => {
  const handleDownload = () => {
    const url = `http://localhost:8017/download/${index}`; // Adjust this if your server URL is different
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${index}.json`); // Set filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { theme } = useTheme();

  return (
    <button
      onClick={handleDownload}
      className={`${theme === 'dark' ? "bg-gray-700 hover:bg-gray-900 text-white" : "bg-gray-200 hover:bg-gray-100 text-black"}  font-bold py-2 px-4 rounded  transition`}
    >
      Download {index}.json
    </button>
  );
};

export default DownloadButton;
