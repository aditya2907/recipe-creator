import React, { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Box,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY; // Use environment variable

// Function to generate a recipe using OpenAI API
const generateRecipe = async (
    ingredients: string[],
    preferences: string,
    cuisine: string
): Promise<string> => {
    const prompt = `
  Create a recipe using the following:
  - Ingredients: ${ingredients.join(", ")}
  - Preferences: ${preferences}
  - Cuisine: ${cuisine}

  Provide:
  - Recipe title
  - Ingredients list
  - Instructions
  `;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4", // Adjust based on your API access
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500,
            },
            { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
        );

        if (response.data && response.data.choices && response.data.choices[0]?.message?.content) {
            return response.data.choices[0].message.content;
        } else {
            throw new Error("No valid response from the API");
        }
    } catch (error) {
        console.error("Error generating recipe:", error);
        throw new Error("Failed to generate recipe. Please try again.");
    }
};

// Recipe Creator Component
const RecipeCreator: React.FC = () => {
    const [ingredients, setIngredients] = useState<string>("");
    const [preferences, setPreferences] = useState<string>("");
    const [cuisine, setCuisine] = useState<string>("");
    const [recipe, setRecipe] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleGenerateRecipe = async () => {
        if (!ingredients.trim()) {
            toast.error("Please enter ingredients!");
            return;
        }

        setLoading(true);
        setRecipe("");
        try {
            const result = await generateRecipe(
                ingredients.split(",").map((item) => item.trim()),
                preferences,
                cuisine
            );
            if (result) {
                setRecipe(result);
            } else {
                toast.error("Received an empty response. Try again!");
            }
        } catch (error) {
            toast.error((error as Error).message);
        }
        setLoading(false);
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
            <Typography variant="h3" gutterBottom align="center">
                AI Recipe Creator
            </Typography>
            <Card variant="outlined">
                <CardContent>
                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Ingredients (comma separated)"
                            variant="outlined"
                            fullWidth
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                        />
                        <TextField
                            label="Dietary Preferences (e.g., vegan, keto)"
                            variant="outlined"
                            fullWidth
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                        />
                        <TextField
                            label="Cuisine Type (e.g., Italian)"
                            variant="outlined"
                            fullWidth
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGenerateRecipe}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Generate Recipe"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {recipe && (
                <Box mt={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Generated Recipe
                            </Typography>
                            <Typography
                                variant="body1"
                                style={{ whiteSpace: "pre-wrap" }}
                            >
                                {recipe}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Box>
    );
};

export default RecipeCreator;
