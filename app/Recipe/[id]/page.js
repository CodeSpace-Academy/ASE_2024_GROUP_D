import { Suspense } from "react";
import Image from "next/image";
import BackButton from "../../components/ui/BackButton";
import { fetchRecipeById } from '../../api';
import ImageGallery from '../../components/ImageGallery';
import Loading from './loading';
import EditableRecipeDetails from '../../components/EditableRecipeDetails'
import ReviewsSection from '../../components/ReviewsSection';
import AllergensSection from '../../components/AllergensSection';
import VoiceAssistant from "../../components/VoiceAssistant";
import RecipeIngredientsSelector from '../../components/RecipeIngredientsSelector'
import Link from 'next/link';

// Generate metadata for the recipe page dynamically
export async function generateMetadata({ params }) {
    const { id } = params;
    const recipe = await fetchRecipeById(id);

    if (!recipe) {
        return {
            title: "Recipe not found",
            description: "Error occurred while fetching the recipe.",
        };
    }

    return {
        title: recipe.title || "Untitled Recipe",
        description: recipe.description || "No description available.",
        openGraph: {
            title: recipe.title || "Untitled Recipe",
            description: recipe.description || "No description available.",
            images: recipe.images?.[0] || "/0.png",
            type: "article",
        },
    };
}

// Main Recipe Page Component
export default async function RecipePage({ params }) {
    const { id } = params;
    let recipe;
    let load = true;
    let error = null;

    try {
        recipe = await fetchRecipeById(id);
    } catch (error) {
        console.error("Error fetching recipe:", error);
        error = "Failed to load recipe data.";
    } finally {
        load = false;
    }

    if (error) {
        throw error;
    }

    return (
        <div className="min-h-screen bg-[#fcfde2] dark:bg-[#1c1d02] py-8">
            <Suspense fallback={<Loading />}>
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Back Button */}
                    <div className="absolute left-4 mb-8">
                        <BackButton />
                    </div>

                    <div className="space-y-8">
                        {/* Image and Details Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-950 rounded-2xl shadow-xl p-6 overflow-hidden">
                            {/* Left Side: Image */}
                            <div className="flex justify-center items-center">
                                {recipe.images && recipe.images.length > 0 ? (
                                    <ImageGallery images={recipe.images} />
                                ) : recipe.images?.[0] ? (
                                    <Image
                                        src={recipe.images[0]}
                                        alt={recipe.title || 'Recipe Image'}
                                        width={300}
                                        height={200}
                                        className="w-full h-[400px] object-cover rounded-2xl"
                                    />
                                ) : (
                                    <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-950 rounded-xl flex items-center justify-center">
                                        <p className="text-[#020123] dark:text-[#dddcfe]">No image available</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Details */}
                            <div className="flex flex-col justify-center space-y-4">
                                <h1 className="text-2xl font-bold text-[#fc9d4f] dark:text-[#b05103]">
                                    {recipe.title || 'Untitled Recipe'}
                                </h1>
                                <div className="flex flex-wrap gap-2">
                                    {recipe.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-[#f9efd2] dark:bg-[#1c1d02] dark:text-[#dddcfe] hover:bg-[#edd282] text-[#020123] rounded-xl text-sm font-medium uppercase tracking-wide transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Allergens Section */}
                                <AllergensSection recipeId={id} />
                                {/* Editable Recipe Details */}
                                <EditableRecipeDetails
                                    recipe={recipe}
                                />

                                {/* Nutrition info */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-[#fc9d4f] dark:text-[#b05103]">Nutrition</h2>
                                    <ul className="list-disc list-inside">
                                        {Object.entries(recipe.nutrition || {}).map(([key, value], index) => (
                                            <li key={index} className='text-[#020123] dark:text-[#dddcfe]'>
                                                {key}: {value}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients and Instructions Section*/}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-950 rounded-2xl shadow-xl p-6">
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-[#fc9d4f] dark:text-[#b05103]">Ingredients</h2>
                                <RecipeIngredientsSelector ingredients={recipe.ingredients || {}} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-[#fc9d4f] dark:text-[#b05103]">Instructions</h2>
                                <ol className="list-decimal list-inside">
                                    {Object.entries(recipe.instructions || {}).map(([key, value], index) => (
                                        <li key={index} className="text-[#020123] dark:text-[#dddcfe]">
                                            {key}: {value}
                                        </li>
                                    ))}
                                </ol>
                                <VoiceAssistant instructions={recipe.instructions || []} />
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-[#fc9d4f] dark:text-[#b05103]">Reviews</h2>
                            <ReviewsSection recipeId={id} />
                        </div >

                        {/* Footer Information */}
                        < div className="mt-8 bg-white dark:bg-[#1c1d02] p-6 rounded-xl shadow-xl" >
                            <p className="text-sm text-[#020123] dark:text-[#dddcfe]">
                                <strong>Published:</strong> {new Date(recipe.published).toDateString()}
                            </p>
                            <p className="text-sm text-[#020123] dark:text-[#dddcfe]">
                                <strong>Prep Time:</strong> {recipe.prep} minutes
                            </p>
                            <p className="text-sm text-[#020123] dark:text-[#dddcfe]">
                                <strong>Cook Time:</strong> {recipe.cook} minutes
                            </p>
                            <p className="text-sm text-[#020123] dark:text-[#dddcfe]">
                                <strong>Servings:</strong> {recipe.servings}
                            </p>
                            <p className="text-sm text-[#020123] dark:text-[#dddcfe]">
                                <strong>Category:</strong> {recipe.category}
                            </p>
                        </div >

                        <Link href="/shopping_lists">
                            <p className="mt-4 px-4 py-2 bg-[#fc9d4f] dark:bg-[#b05103] text-white rounded-xl">
                                View Shopping List
                            </p>
                        </Link>
                    </div >
                </div >
            </Suspense >
        </div >

    );
}


