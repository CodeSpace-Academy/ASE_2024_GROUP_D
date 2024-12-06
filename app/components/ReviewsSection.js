"use client";
import { useState, useEffect } from "react";

const StarRating = ({ averageRating, editable = false, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingChange = (rating) => {
    if (editable && onRatingChange) {
      onRatingChange(rating);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoverRating || averageRating);
      
      return editable ? (
        <span
          key={index}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleRatingChange(starValue)}
          className={`cursor-pointer text-2xl ${
            isActive ? 'text-yellow-500' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ) : (
        <span
          key={index}
          className={`text-2xl ${
            isActive ? 'text-yellow-500' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      );
    });
  };

  return <div className="flex">{renderStars()}</div>;
};

const ReviewsSection = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "", recipeId });
  const [username, setUsername] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [sortOption, setSortOption] = useState({ sortBy: "rating", order: "desc" });
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/recipes/${recipeId}/reviews?sortBy=${sortOption.sortBy}&order=${sortOption.order}`
        );
        if (!response.ok) throw new Error("Failed to fetch reviews.");
        const data = await response.json();
        
        // Use data.reviews with a fallback, set average rating from API response
        setReviews(data.reviews || []); 
        setAverageRating(data.averageRating || 0);
      } catch (error) {
        setMessage({ text: "Failed to fetch reviews.", type: "error" });
        setReviews([]); // Ensure reviews is always an array
      }
    };
    fetchReviews();
  }, [recipeId, sortOption]);

  const handleReviewSubmit = async () => {
    try {
      setIsLoading(true);
      const method = editMode ? "PUT" : "POST";
      const endpoint = editMode
        ? `/api/recipes/${recipeId}/reviews?editId=${editReviewId}`
        : `/api/recipes/${recipeId}/reviews`;
  
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newReview,
          username: username.trim() || "Anonymous",
        }),
      });
  
      if (!response.ok) throw new Error("Failed to submit review.");
  
      const updatedReview = await response.json();
  
      if (editMode) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === editReviewId ? updatedReview : review
          )
        );
      } else {
        setReviews((prevReviews) => [updatedReview, ...prevReviews]);
      }
  
      setMessage({
        text: editMode ? "Review updated successfully!" : "Review added successfully!",
        type: "success",
      });
  
      // Reset fields
      setNewReview({ rating: 0, comment: "", recipeId });
      setUsername("");
      setEditMode(false);
      setEditReviewId(null);
    } catch (error) {
      setMessage({ text: "Failed to submit review.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = (review) => {
    setEditMode(true);
    setEditReviewId(review._id);
    setNewReview({ rating: review.rating, comment: review.comment, recipeId });
    setUsername(review.username || "");
  };

  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/recipes/${recipeId}/reviews?deleteId=${reviewId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete review.");

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );
      setMessage({ text: "Review deleted successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to delete review.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split("-");
    setSortOption({ sortBy, order });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="flex items-center space-x-2">
          <StarRating averageRating={averageRating} />
          <span className="text-gray-600">({reviews.length} reviews)</span>
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-4 ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="sort" className="mr-2">Sort by:</label>
        <select
          id="sort"
          onChange={handleSortChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="rating-desc">Rating (Highest)</option>
          <option value="rating-asc">Rating (Lowest)</option>
          <option value="date-desc">Newest</option>
          <option value="date-asc">Oldest</option>
        </select>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold">{review.username || "Anonymous"}</span>
                <StarRating averageRating={review.rating} />
              </div>
              <div className="text-sm text-gray-500">
                {new Date(review.updatedAt || review.createdAt).toLocaleString()}
              </div>
            </div>
            <p className="text-gray-800 mb-2">{review.comment}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(review)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(review._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">
          {editMode ? "Edit Review" : "Add a Review"}
        </h3>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Your Name:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Rating:</label>
          <StarRating 
            averageRating={newReview.rating} 
            editable={true} 
            onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block mb-2">Comment:</label>
          <textarea
            id="comment"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Enter your comment"
            className="w-full px-3 py-2 border rounded-md"
            rows="4"
          />
        </div>
        <button
          onClick={handleReviewSubmit}
          disabled={isLoading}
          className="bg-[#fc9d4f] hover:bg-[#f9efd2] text-[#020123] font-semibold px-4 py-2 rounded-md"
        >
          {isLoading ? "Submitting..." : editMode ? "Update Review" : "Add Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewsSection;