import { ObjectId } from 'mongodb';

async function createReview(db, reviewData) {
  const collection = db.collection('recipes');
  const recipeId = reviewData.recipeId;

  try {
    await validateRecipe(db, recipeId);
  } catch (error) {
    throw new Error(`Recipe validation error: ${error.message}`);
  }

  const review = {
    _id: new ObjectId(),
    rating: Number(reviewData.rating),
    comment: reviewData.comment,
    username: reviewData.username || 'Anonymous',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const updateResult = await collection.updateOne(
      { _id: recipeId },
      { $push: { reviews: review }, $set: { updatedAt: new Date() } }
    );
    if (updateResult.modifiedCount === 0) {
      throw new Error('Failed to add review to the recipe');
    }
  } catch (error) {
    throw new Error(`Database update error: ${error.message}`);
  }

  try {
    await updateAverageRating(db, recipeId);
  } catch (error) {
    throw new Error(`Error updating average rating: ${error.message}`);
  }

  return review;
}

async function validateRecipe(db, recipeId) {
  const recipe = await db.collection('recipes').findOne({ _id: recipeId });
  if (!recipe) {
    throw new Error('Recipe not found');
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
        { 
          $set: { 
            averageRating: 0,
            reviewCount: 0 
          } 
        }
      );
      return;
    }

    const totalRating = recipe.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Number((totalRating / recipe.reviews.length).toFixed(1));

    await collection.updateOne(
      { _id: recipeId },
      { 
        $set: { 
          averageRating,
          reviewCount: recipe.reviews.length 
        } 
      }
    );
  } catch (error) {
    throw new Error(`Error updating average rating: ${error.message}`);
  }
}

async function updateReview(db, reviewId, updateData) {
  const collection = db.collection('recipes');
  const objectId = typeof reviewId === 'string' ? new ObjectId(reviewId) : reviewId;

  const update = {
    $set: {
      "reviews.$.rating": Number(updateData.rating),
      "reviews.$.comment": updateData.comment,
      "reviews.$.updatedAt": new Date(),
      updatedAt: new Date(),
    }
  };

  try {
    const result = await collection.updateOne(
      { "reviews._id": objectId },
      update
    );

    if (result.matchedCount === 0) {
      throw new Error('Review not found');
    }

    const recipe = await collection.findOne(
      { "reviews._id": objectId },
      { projection: { _id: 1 } }
    );

    if (recipe) {
      await updateAverageRating(db, recipe._id);
    }

    const updatedRecipe = await collection.findOne(
      { _id: recipe._id, "reviews._id": objectId },
      { projection: { "reviews.$": 1 } }
    );

    return updatedRecipe.reviews[0];
  } catch (error) {
    throw new Error(`Error updating review: ${error.message}`);
  }
}

async function deleteReview(db, reviewId) {
  const collection = db.collection('recipes');

  try {
    const objectId = typeof reviewId === 'string' ? new ObjectId(reviewId) : reviewId;

    const recipe = await collection.findOne(
      { "reviews._id": objectId },
      { projection: { _id: 1 } }
    );

    if (!recipe) {
      throw new Error('Review not found');
    }

    const result = await collection.updateOne(
      { _id: recipe._id },
      {
        $pull: { reviews: { _id: objectId } },
        $set: { updatedAt: new Date() }
      }
    );

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
      { projection: { reviews: 1, averageRating: 1, reviewCount: 1 } }
    );

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    let reviews = recipe.reviews || [];

    // Apply sorting based on the provided sort options
    if (sortOptions) {
      const { sortBy, order } = sortOptions;
      reviews.sort((a, b) => {
        const multiplier = order.toLowerCase() === 'asc' ? 1 : -1;

        switch (sortBy.toLowerCase()) {
          case 'rating':
            return (a.rating - b.rating) * multiplier;
          case 'date':
            return (new Date(a.createdAt) - new Date(b.createdAt)) * multiplier;
          default:
            return 0;
        }
      });
    }

    // Return reviews with additional recipe metadata
    return {
      reviews,
      averageRating: recipe.averageRating || 0,
      reviewCount: recipe.reviewCount || 0
    };
  } catch (error) {
    throw new Error(`Error getting recipe reviews: ${error.message}`);
  }
}

async function getReviewStatistics(db, recipeId) {
  const collection = db.collection('recipes');

  try {
    const recipe = await collection.findOne(
      { _id: recipeId },
      { projection: { reviews: 1 } }
    );

    if (!recipe || !recipe.reviews) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: [0, 0, 0, 0, 0]
      };
    }

    const reviews = recipe.reviews;
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;

    // Calculate rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => 
      reviews.filter(review => review.rating === rating).length
    );

    return {
      totalReviews,
      averageRating,
      ratingDistribution
    };
  } catch (error) {
    throw new Error(`Error getting review statistics: ${error.message}`);
  }
}

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getRecipeReviews,
  updateAverageRating,
  getReviewStatistics
};