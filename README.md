# Project Overview:

Kwamaimai is a dynamic recipe web application for designed users to discover, share, and interact with recipes. The application combines robust search and filtering capabilities with social features, allowing users to rate, review, and save their favorite recipes.

#### Technology Stack

##### Frontend:

- React:
- Next.js

##### Database:

- MongoDB:

##### Backend & API:

- Next.js API Routes

#### Features:

- Search
- Filter
- Sort
- Sign-up/ Log-in
- Favouriting
- Rate & Review
- Edit description
- Edit user profile
- Add to shopping list
- Image Carousel
- Offline usage
- Pagination
- Navigation to recipe details

# Demo

Link: [https://kwamaimai.vercel.app/]

# Installation Instructions

1. Clone the repository:
   git clone <repository_url>

2. Navigate to the project folder:
   ase_group-d

3. Install Dependencies:
   npm install

4. Run the development server
   npm run dev

# Environmental Variables setup

Environment variables are crucial for configuring the app for local development. Here's a step-by-step guide to set up and manage them effectively:

NB! Please use the contact given to get the pairs for the environment variables

1. In the root directory of your project, look for a file named .env or .env.local
2. If no .env file exists, create one.
3. In the .env.local file, write key-value with pairs. Each line represents one environment variable:

#### Server Configuration

- NEXTAUTH_URL=http://localhost:3000
- NEXTAUTH_SECRET=your_secret_key

#### Google OAuth

- AUTH_GOOGLE_ID=your_google_client_id
- AUTH_GOOGLE_SECRET=your_google_client_secret

#### Database Configuration

- MONGODB_URI=your_connection_string

# Project Structure

root/
- ├── .next/
- ├── app/
- ├── api/
- │ ├── auth/
- │ │ └── nextauth/route.js
- │ ├── checkuser/route.js
- │ └── login/route.js
- ├── components/
- │ ├── ui/
- │ │ ├── alert.js
- │ │ └── button.js
- │ ├── BackButton.js
- │ ├── Carousel.js
- │ ├── CategoryList.js
- │ ├── CollapsibleSection.js
- │ ├── EditableRecipeDetails.js
- │ ├── FavoriteButton.js
- │ ├── FilterButton.js
- │ ├── Footer.js
- │ ├── Header.js
- │ ├── ImageGallery.js
- │ ├── IngredientList.js
- │ ├── LoadingSpinner.js
- │ ├── Pagination.js
- │ ├── RecipeCarousel.js
- │ ├── RecipeGrid.js
- │ ├── Recipes.js
- │ ├── ReviewsSection.js
- │ ├── SearchBar.js
- │ ├── SortControl.js
- │ ├── StepsDropdown.js
- │ ├── TagList.js
- │ ├── ThemeButton.js
- │ ├── UserModal.js
- │ └── editdetails/
- │ └── page.js
- ├── fonts/
- ├── hook/
- ├── images/
- ├── Recipe/[id]/
- ├── styles/global.css
- ├── api.js
- ├── error.js
- ├── layout.js
- ├── loading.js
- ├── not-found.js
- ├── page.js
- ├── providers.js
- ├── review.js
- ├── lib/
- │ ├── AuthMiddleware.js
- │ ├── utils.js
- ├── components/
- ├── public/
- ├── auth.js
- ├── db.js
- ├── next.config.mjs
- ├── packgae-lock.json
- ├── package.json
- ├── postcss.config.mjs
- ├── ReadMe.md
- ├── tailwind.config.js
- ├── testConnection.js

# API Documentation

This section outlines the key API endpoints available in the application, their purpose, how to use them, and what responses to expect.

#### BASE URL

http://localhost:3000 

##### API Endpoints

This section outlines the key API endpoints available in the application, their purpose, how to use them, and what responses to expect. Each endpoint is hosted on /api/ under the Next.js framework, utilizing serverless functions.

#### 1. Authentication Endpoints

##### Routes:

- /api/auth/login
- /api/auth/signup
- /api/auth/logout
- /api/auth/checkuser
- /api/auth/user/[email]/profile

##### Description

Handles user authentication processes, including login, signup, logout, and profile verification.

##### Methods

- POST: /api/auth/login
- Validates user credentials and returns an authentication token.

- Request Body (example):
  {
  "email": "user@example.com",
  "password": "securePassword"
  }
- Responses:

  - 200 OK: Returns authentication token.
  - 400 Unauthorized: User not found or Invalid password.

- POST /api/auth/register
- Creates a new user account.
- Request Body (example):
  {
  "full name: "user",
  "phone number: "1234567890",
  "email": "user@example.com",
  "password": "securePassword"
  }
- Responses:
- 201 Created: User created successfully.
- 400 Bad Request: User already exists.

2. Recipe Endpoints

##### Route

- /api/recipes
[http://localhost:3000.api/recipes]
##### Description

Handles CRUD operations for recipes.

##### Methods

- GET /api/recipes
  - Retrieves a list of recipes.
  - Responses:
  - 200 OK: List of recipes.
- POST /api/recipes
  - Adds a new recipe (requires authentication).
  - Request Body (example):
    {
    "title": "Chocolate Cake",
    "ingredients": ["flour", "sugar", "cocoa powder"],
    "instructions": "Mix ingredients and bake."
    }
- Responses:
  - 201 Created: Recipe created successfully.
  - 400 Bad Request: Missing or invalid data.

3. Profile Endpoints

##### Route

- /api/profile

##### Description

Provides user profile data and allows updates.

##### Methods

- GET /api/profile

  - Retrieves the current user’s profile.
  - Responses:
    - 200 OK: User profile details.
    - 401 Unauthorized: No valid authentication token provided.

- PUT /api/profile
  - Updates user information.
  - Request Body (example):
    {
    "name": "Updated Name",
    "email": "updated_email@example.com"
    }
- Responses:
  - 200 OK: Update confirmation.
  - 400 Bad Request: Invalid update data.

4.  Favorites Endpoints

##### Route

- /api/favorites

##### Description

Manages users' favorite recipes.

##### Methods

- GET /api/favorites

  - Retrieves the user’s favorite recipes.
  - Responses:
    - 200 OK: List of favorite recipes.

- POST /api/favorites
  - Adds a recipe to favorites.
  - Responses:
    - 201 Created: Recipe added to favorites.
- DELETE /api/favorites
  - Removes a recipe from favorites.
  - Responses:
    - 200 OK: Recipe removed from favorites.

5. Reviews Endpoints

##### Route

- /api/reviews

##### Description

Handles user reviews for recipes.

##### Methods

- GET /api/reviews?recipeId=<id>

  - Retrieves reviews for a specific recipe.
  - Responses:
    - 200 OK: List of reviews.

- POST /api/reviews
  - Adds a new review to a recipe.
  - Request Body (example):
    {
    "recipeId": "123",
    "review": "Delicious recipe!"
    }
- Responses:
  - 201 Created: Review added successfully.

6.  Categories Endpoints

##### Route

- /api/recipes/categories
[http://localhost:3000/api/recipes/categories]

##### Description

Retrieves available recipe categories.

##### Methods

- GET /api/recipes/categories
  - Fetches a list of recipe categories.
  - Responses:
    - 200 OK: List of categories.

7.  Ingredients Endpoints
    ##### Route
    - /api/ingredients
    ##### Description
    Provides ingredient data, including substitutes and availability.

##### Methods

- GET /api/ingredients
  - Fetches ingredient details.
  - Responses:
    - 200 OK: List of ingredients.

8.  Recommendations Endpoints
    ##### Route
    - /api/recommendations
    ##### Description
    Suggests recipes based on user preferences, history, or trending recipes.

##### Methods

- GET /api/recommendations
  - Retrieves personalized recipe recommendations.
  - Responses:
    - 200 OK: List of recommended recipes.

9. Tags Endpoints
   ##### Route
   - /api/tags
   ##### Description
   Manages recipe tags for better categorization and filtering.

##### Methods

- GET /api/tags
  - Retrieves available tags.
  - Responses:
    - 200 OK: List of tags.

10. Shopping List Endpoints
    ##### Route
    - /api/shopping-list
    ##### Description
    Handles users' shopping lists for recipes.

##### Methods

- GET /api/shopping-list
  - Retrieves the shopping list.
  - Responses:
    - 200 OK: List of items.
- POST /api/shopping-list
  - Adds an item to the shopping list.
  - Responses:
    - 201 Created: Item added successfully.

11. Instructions Endpoints
    ##### Route
    - /api/instructions
    ##### Description
    Provides step-by-step instructions for recipes.

##### Methods

- GET /api/instructions?recipeId=<id>
  - Retrieves instructions for a specific recipe.
  - Responses:
    - 200 OK: Recipe instructions.

12. Manifest
    ##### Route
    - /api/manifest
    ##### Description
    Fetches the application manifest for metadata and integration.

##### Methods

- GET /api/manifest
  - Retrieves the manifest.
  - Responses:
    - 200 OK: Manifest data.

# Contact Information

Email: [groupd.ase@gmail.com]

<!--
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
 -->
