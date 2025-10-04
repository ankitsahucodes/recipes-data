const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect")
const Recipe = require("./models/recipe.model")

app.use(express.json());

initializeDatabase()

// 3. & 4. & 5. Create an API with route "/recipes" to create a new recipe in the recipes database. 

async function createRecipe(newRecipe) {
    try {
        const recipe = new Recipe(newRecipe)
        const saveRecipe = await recipe.save()
        return saveRecipe
    } catch (error) {
        throw error
    }
}

app.post("/recipes", async (req, res) => {
    try {
    const savedRecipe = await createRecipe(req.body);
    res
      .status(201)
      .json({ message: "Recipe added successfully.", recipe: savedRecipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to add recipe." });
  }
})


// 6. get all the recipes in the database as a response

async function readAllRecipes() {
  try {
    const allRecipes = await Recipe.find();
    return allRecipes;
  } catch (error) {
    throw error
  }
}



app.get("/recipes", async (req, res) => {
  try {
    const recipes = await readAllRecipes();
    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "No recipe found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe." });
  }
});

// 7. get a recipe's details by its title

async function readRecipeByTitle(recipeTitle) {
  try {
    const recipe = await Recipe.findOne({ title: recipeTitle });
    return recipe;
  } catch (error) {
    throw error;
  }
}


app.get("/recipes/:title", async (req, res) => {
  try {
    const recipe = await readRecipeByTitle(req.params.title);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe." });
  }
});

// 8. get details of all the recipes by an author


async function readRecipeByAuthor(authorName) {
  try {
    const recipeByAuthor = await Recipe.find({ author: authorName });
    return recipeByAuthor;
  } catch (error) {
    throw error;
  }
}


app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const recipe = await readRecipeByAuthor(req.params.authorName);
    if (recipe.length != 0) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe." });
  }
});

// 9. get all the recipes that are of "Easy" difficulty level.

async function readRecipeByDifficulty(level) {
  try {
    const recipe = await Recipe.find({difficulty: level})
    return recipe
  } catch (error) {
    throw error
  }
}

app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try {
    const recipe = await readRecipeByDifficulty(req.params.difficultyLevel)
    if (recipe.length != 0) {
      res.json(recipe)
    } else {
      res.status(404).json({error: "Recipe not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch recipe."})
  }
})

// 10. Update 

async function updateRecipe(recipeId, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {
      new: true,
    });
    return updatedRecipe;
  } catch (error) {
    console.log("Error in updating Recipe details", error);
  }
}

app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipe(req.params.recipeId, req.body);
    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully.",
        updatedRecipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to update recipe." });
  }
});

// 11. update a recipe's prep time and cook time with the help of its title

async function updateRecipeByTitle(recipeTitle, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {
      new: true,
    });
    return updatedRecipe;
  } catch (error) {
    console.log("Error in updating Recipe details", error);
  }
}

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle, req.body);
    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully.",
        updatedRecipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to update recipe." });
  }
});

// 12. delete a recipe with the help of a recipe id

async function deleteRecipe(recipeId) {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deletedRecipe;
  } catch (error) {
    throw error
  }
}

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipe(req.params.recipeId);
    if (deletedRecipe) {
      res.status(200).json({ message: "Recipe deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
