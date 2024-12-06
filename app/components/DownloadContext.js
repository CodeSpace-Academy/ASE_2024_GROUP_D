// // DownloadContext.js
// 'use client'
// import { createContext, useContext, useState } from 'react';

// const DownloadContext = createContext();

// export const DownloadProvider = ({ children }) => {
//     const [downloadedRecipes, setDownloadedRecipes] = useState(() => {
//         // Get downloaded recipes from localStorage on initial load
//         if (typeof window !== 'undefined') {
//             const savedRecipes = localStorage.getItem('downloadedRecipes');
//             return savedRecipes ? JSON.parse(savedRecipes) : {};
//         }
//         return {};
//     });

//     const downloadRecipe = (id, recipe) => {
//         setDownloadedRecipes((prevRecipes) => {
//             const newRecipes = { ...prevRecipes, [id]: recipe };
//             localStorage.setItem('downloadedRecipes', JSON.stringify(newRecipes));
//             return newRecipes;
//         });
//     };

//     return (
//         <DownloadContext.Provider value={{ downloadedRecipes, downloadRecipe }}>
//             {children}
//         </DownloadContext.Provider>
//     );
// };

// export const useDownload = () => useContext(DownloadContext);
