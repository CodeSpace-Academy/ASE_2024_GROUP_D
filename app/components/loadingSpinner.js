export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-screen">
            {/* Spinner element styled to rotate (using `animate-spin`) and form a circular loading indicator */}
            <div
                className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ff4f1a]"
                role="status" // ARIA role to define this as a status element for accessibility
            ></div>

            {/* Loading message text next to the spinner */}
            <span className="ml-4 text-[#ff4f1a] text-lg font-medium">
                Loading...
            </span>
        </div>
    );
}
