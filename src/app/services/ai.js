// const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// const GEMINI_URL =
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

// export const getAIMovieRecommendations = async (
//     prompt,
//     favoriteGenres = []
// ) => {
//     if (!GEMINI_API_KEY) {
//         throw new Error("Gemini API key is missing.");
//     }

//     const systemPrompt = `
// You are Kevi's intelligent movie recommendation AI.

// Your job is to understand what the user actually wants to watch and recommend real feature films that match their request.

// IMPORTANT:
// The user may describe what they want in a natural, emotional, conversational, or detailed way.
// Do NOT require the user to mention a movie genre.

// Understand the meaning behind the request.

// For example:

// - If the user says they are tired after working all day and want something to relieve stress, understand that they may want something relaxing, funny, comforting, lighthearted, entertaining, or easy to watch.
// - If the user says they want to cry, understand that they may want an emotional or moving movie.
// - If the user says they want to forget about everything for a while, consider immersive, entertaining, escapist movies.
// - If the user says they want something that will keep them awake, consider exciting, intense, suspenseful, or fast-paced movies.
// - If the user describes several requirements, understand ALL of them and find movies that satisfy as many as reasonably possible.
// - If the user gives a very specific request, prioritize that request.
// - If the request is broad, provide a wider variety of movies that still fit the overall mood.

// You can understand requests involving:

// - Mood
// - Emotions
// - Stress or relaxation
// - Energy level
// - Pacing
// - Genre
// - Subgenre
// - Story type
// - Themes
// - Setting
// - Time period
// - Language
// - Actors
// - Directors
// - Similar movies
// - Movie franchises
// - Animation
// - Romance
// - Comedy
// - Horror
// - Thriller
// - Action
// - Adventure
// - Science fiction
// - Fantasy
// - Mystery
// - Drama
// - Family entertainment
// - Feel-good movies
// - Comfort movies
// - Dark movies
// - Thought-provoking movies
// - Mind-bending movies
// - Movies for specific situations
// - Combinations of multiple preferences

// Do not simply repeat the user's words.
// Use the meaning of the request to determine what kind of movies would actually satisfy them.

// USER'S SAVED FAVORITE TMDB GENRE IDS:
// ${favoriteGenres.length > 0 ? favoriteGenres.join(", ") : "None provided"}

// Use the user's favorite genres as an additional preference when appropriate.

// IMPORTANT:
// The user's current request is more important than their saved favorite genres.

// If the user asks for something that does not match their favorite genres, follow the user's current request.

// USER REQUEST:
// "${prompt}"

// RECOMMENDATION RULES:

// 1. Recommend ONLY real feature films.
// 2. Do NOT recommend TV shows or TV episodes.
// 3. Do NOT invent movie titles.
// 4. Do NOT recommend fictional movies that do not exist.
// 5. Do NOT recommend the same movie more than once.
// 6. Prefer movies that are likely to exist in TMDB.
// 7. Match the user's request as closely as possible.
// 8. Consider the user's mood and situation, not only explicit genre words.
// 9. If the request contains multiple requirements, consider them together.
// 10. If the request is broad, provide a diverse selection while staying relevant.
// 11. Prefer well-established movies when there is uncertainty about whether a title exists.
// 12. Do not recommend obscure or uncertain titles merely to increase the number of recommendations.
// 13. Return between 1 and 30 movies.
// 14. For broad requests, return as many relevant movies as you can confidently recommend, up to 30.
// 15. Do not force the list to 30 if fewer than 30 movies genuinely match the request.
// 16. Every movie should be meaningfully relevant to the user's request.
// 17. Do not rank movies as "best", "worst", or assign numerical scores.
// 18. Do not include explanations outside the JSON response.

// For every movie return:

// - title
// - year
// - reason

// The reason should:
// - Be short and natural.
// - Explain why the movie fits the user's request.
// - Reflect the user's actual mood/request.
// - Avoid generic statements such as "This is a great movie."

// The intro should:
// - Be one short natural sentence.
// - Reflect the overall mood of the recommendations.
// - Sound conversational.
// - Not repeat the user's entire request.

// Return ONLY valid JSON in this exact structure:

// {
//   "intro": "One short sentence describing the recommendation mood.",
//   "movies": [
//     {
//       "title": "Movie Title",
//       "year": 2024,
//       "reason": "Short explanation of why this movie matches."
//     }
//   ]
// }
// `;

//     const response = await fetch(
//         `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 contents: [
//                     {
//                         parts: [
//                             {
//                                 text: systemPrompt,
//                             },
//                         ],
//                     },
//                 ],
//                 generationConfig: {
//                     temperature: 0.8,
//                     responseMimeType: "application/json",
//                     responseSchema: {
//                         type: "object",
//                         properties: {
//                             intro: {
//                                 type: "string",
//                             },
//                             movies: {
//                                 type: "array",
//                                 maxItems: 30,
//                                 items: {
//                                     type: "object",
//                                     properties: {
//                                         title: {
//                                             type: "string",
//                                         },
//                                         year: {
//                                             type: "integer",
//                                         },
//                                         reason: {
//                                             type: "string",
//                                         },
//                                     },
//                                     required: [
//                                         "title",
//                                         "year",
//                                         "reason",
//                                     ],
//                                 },
//                             },
//                         },
//                         required: [
//                             "intro",
//                             "movies",
//                         ],
//                     },
//                 },
//             }),
//         }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//         console.log("Gemini error:", data);

//         const errorMessage =
//             data?.error?.message || "Gemini request failed.";

//         if (
//             errorMessage.toLowerCase().includes("high demand") ||
//             errorMessage.toLowerCase().includes("try again later") ||
//             errorMessage.toLowerCase().includes("overloaded")
//         ) {
//             throw new Error(
//                 "Kevi's AI is temporarily busy. Please try again in a moment."
//             );
//         }

//         throw new Error(errorMessage);
//     }

//     const text =
//         data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!text) {
//         throw new Error(
//             "Gemini returned no recommendation."
//         );
//     }

//     try {
//         const result = JSON.parse(text);

//         if (!result || !Array.isArray(result.movies)) {
//             throw new Error(
//                 "Invalid recommendation format."
//             );
//         }

//         return {
//             intro: result.intro || "",
//             movies: result.movies.slice(0, 30),
//         };
//     } catch (error) {
//         console.log(
//             "Gemini JSON parsing error:",
//             error
//         );

//         throw new Error(
//             "Kevi received an invalid recommendation response."
//         );
//     }
// };
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const INTERACTIONS_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAIMovieRecommendations = async (
    prompt,
    favoriteGenres = [],
    excludeTitles = [],
    retries = 2
) => {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key is missing.");
    }
const systemPrompt = `You are Kevi's intelligent movie & TV show recommendation AI.

Your job is to understand what the user wants to watch and recommend real movies OR TV series/shows that match their prompt.

USER'S FAVORITE GENRES: ${favoriteGenres.length > 0 ? favoriteGenres.join(", ") : "None provided"}
USER REQUEST: "${prompt}"
${excludeTitles.length > 0 ? `DO NOT RECOMMEND THESE TITLES (ALREADY SHOWN): ${excludeTitles.join(", ")}` : ""}

RULES:
1. Recommend 10 to 15 REAL feature films or TV series/shows matching the prompt.
2. IF THE USER REQUESTS SERIES, SHOWS, OR SEASONS, PRIORITIZE TV SERIES.
3. DO NOT recommend fake or fictional titles.
4. Provide a brief intro and a list of items with "title", "year", and "reason".

OUTPUT FORMAT:
Return ONLY valid JSON with this exact structure and no additional text or markdown formatting:
{
  "intro": "A short, empathetic sentence fitting the user's request.",
  "movies": [
    {
      "title": "Movie or TV Series Title",
      "year": 2024,
      "reason": "Short explanation matching their prompt."
    }
  ]
}`;
//     const systemPrompt = `You are Kevi's intelligent movie recommendation AI.

// Your job is to understand what the user wants to watch and recommend real feature films that match their prompt.

// USER'S FAVORITE GENRES: ${favoriteGenres.length > 0 ? favoriteGenres.join(", ") : "None provided"}
// USER REQUEST: "${prompt}"
// ${excludeTitles.length > 0 ? `DO NOT RECOMMEND THESE TITLES (ALREADY SHOWN): ${excludeTitles.join(", ")}` : ""}

// RULES:
// 1. Recommend 10 to 15 REAL feature films.
// 2. DO NOT recommend TV shows, episodes, or fake/fictional movies.
// 3. Understand emotional nuance (e.g., breakups, stress relief, sci-fi, comedy, comfort).
// 4. Provide a brief intro and a list of movies with "title", "year", and "reason".

// OUTPUT FORMAT:
// Return ONLY valid JSON with this exact structure and no additional text or markdown formatting:
// {
//   "intro": "A short, empathetic sentence fitting the user's request.",
//   "movies": [
//     {
//       "title": "Movie Title",
//       "year": 2024,
//       "reason": "Short explanation matching their prompt."
//     }
//   ]
// }`;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(
                `${INTERACTIONS_URL}?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-goog-api-key": GEMINI_API_KEY,
                    },
                    body: JSON.stringify({
                        model: "gemini-3.8-flash",
                        input: systemPrompt,
                        generation_config: {
                            thinking_level: "low",
                        },
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if ((response.status === 503 || response.status === 429) && attempt < retries) {
                    console.log(`Gemini busy (${response.status}). Retrying attempt ${attempt + 1}...`);
                    await delay(1500 * (attempt + 1));
                    continue;
                }

                console.log("Gemini API Error details:", response.status, data);
                const errorMessage = data?.error?.message || "Gemini request failed.";
                throw new Error(errorMessage);
            }

            let rawText = null;

            // Search steps backward to always grab the LAST text output
            if (Array.isArray(data?.steps)) {
                for (let i = data.steps.length - 1; i >= 0; i--) {
                    const step = data.steps[i];
                    if (Array.isArray(step.content)) {
                        const textObj = step.content.find((item) => item.type === "text" && item.text);
                        if (textObj && textObj.text.trim()) {
                            rawText = textObj.text;
                            break;
                        }
                    }
                }
            }

            if (!rawText) {
                rawText =
                    data?.output_text ||
                    data?.outputs?.[0]?.text ||
                    data?.candidates?.[0]?.content?.parts?.[0]?.text;
            }

            if (!rawText) {
                throw new Error("Gemini returned an empty response.");
            }

            rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

            const result = JSON.parse(rawText);

            if (!result || !Array.isArray(result.movies)) {
                throw new Error("Invalid recommendation format received from AI.");
            }

            return {
                intro: result.intro || "Here are some recommendations for you:",
                movies: result.movies.slice(0, 30),
            };
        } catch (error) {
            if (
                attempt < retries &&
                (error.message.includes("503") || error.message.toLowerCase().includes("demand"))
            ) {
                await delay(1500 * (attempt + 1));
                continue;
            }

            console.log("AI Recommendation Processing Error:", error);

            if (
                error.message.toLowerCase().includes("high demand") ||
                error.message.toLowerCase().includes("overloaded") ||
                error.message.includes("503")
            ) {
                throw new Error("Kevi's AI is temporarily busy. Please try again in a moment.");
            }

            throw new Error(error.message || "Could not generate movie recommendations.");
        }
    }
};