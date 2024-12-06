// DownloadButton.js
import { useDownload } from '../DownloadContext';

const DownloadButton = ({ recipe }) => {
    const { downloadRecipe } = useDownload();

    const handleDownload = () => {
        downloadRecipe(recipe.id, recipe);
        alert('Recipe downloaded for offline use!');
    };

    return (
        <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded">
            Download for Offline Use
        </button>
    );
};

export default DownloadButton;
