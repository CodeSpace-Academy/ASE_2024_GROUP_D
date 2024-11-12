// review.js
async function createReview(db, reviewData) {
  const collection = db.collection('recipes');
  const recipeId = reviewData.recipeId;

  // Validate the recipe
  await validateRecipe(db, recipeId);

  const review = {
    _id: new Date().getTime().toString(),
    userId: reviewData.userId,
    rating: Number(reviewData.rating),
    comment: reviewData.comment,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  try {
    // Add the review and update average rating
    const result = await collection.updateOne(
      { _id: recipeId },
      {
        $push: { reviews: review },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('Recipe not found');
    }

    await updateAverageRating(db, recipeId);
    return review;
  } catch (error) {
    throw new Error(`Error creating review: ${error.message}`);
  }
}

async function validateRecipe(db, recipeId) {
  const recipe = await db.collection('recipes').findOne({ _id: recipeId });
  if (!recipe) {
    throw new Error('Recipe not found');
  }
}

async function updateReview(db, reviewId, updateData) {
  const collection = db.collection('recipes');

  const update = {
    $set: {
      "reviews.$.rating": Number(updateData.rating),
      "reviews.$.comment": updateData.comment,
      "reviews.$.updatedAt": new Date(),
      updatedAt: new Date()
    }
  };

  try {
    const result = await collection.updateOne(
      { "reviews._id": reviewId },
      update
    );

    if (result.matchedCount === 0) {
      throw new Error('Review not found');
    }

    // Update average rating for the recipe
    const recipe = await collection.findOne(
      { "reviews._id": reviewId },
      { projection: { _id: 1 } }
    );
    
    if (recipe) {
      await updateAverageRating(db, recipe._id);
    }

    return result;
  } catch (error) {
    throw new Error(`Error updating review: ${error.message}`);
  }
}

async function deleteReview(db, reviewId) {
  const collection = db.collection('recipes');

  try {
    // First find the recipe containing the review
    const recipe = await collection.findOne(
      { "reviews._id": reviewId },
      { projection: { _id: 1 } }
    );

    if (!recipe) {
      throw new Error('Review not found');
    }

    // Remove the review
    const result = await collection.updateOne(
      { _id: recipe._id },
      {
        $pull: { reviews: { _id: reviewId } },
        $set: { updatedAt: new Date() }
      }
    );

    // Update average rating
    await updateAverageRating(db, recipe._id);

    return result;
  } catch (error) {
    throw new Error(`Error deleting review: ${error.message}`);
  }
}

async function getRecipeReviews(db, recipeId, sortOptions) {
  const collection = db.collection('recipes');

  try {
    const recipe = await collection.findOne(
      { _id: recipeId },
      { projection: { reviews: 1 } }
    );

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    let reviews = recipe.reviews || [];

    // Apply sorting
    if (sortOptions) {
      const { sortBy, order } = sortOptions;
      reviews.sort((a, b) => {
        const multiplier = order.toLowerCase() === 'asc' ? 1 : -1;
        
        switch (sortBy.toLowerCase()) {
          case 'rating':
            return (a.rating - b.rating) * multiplier;
          case 'date':
            return (a.createdAt - b.createdAt) * multiplier;
          default:
            return 0;
        }
      });
    }

    return reviews;
  } catch (error) {
    throw new Error(`Error getting recipe reviews: ${error.message}`);
  }
}

async function updateAverageRating(db, recipeId) {
  const collection = db.collection('recipes');

  try {
    const recipe = await collection.findOne(
      { _id: recipeId },
      { projection: { reviews: 1 } }
    );

    if (!recipe || !recipe.reviews || recipe.reviews.length === 0) {
      await collection.updateOne(
        { _id: recipeId },
        { $set: { averageRating: 0 } }
      );
      return;
    }

    const totalRating = recipe.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Number((totalRating / recipe.reviews.length).toFixed(1));

    await collection.updateOne(
      { _id: recipeId },
      { $set: { averageRating } }
    );
  } catch (error) {
    throw new Error(`Error updating average rating: ${error.message}`);
  }
}

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getRecipeReviews,
  updateAverageRating
};