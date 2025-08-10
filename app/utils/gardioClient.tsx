// import { Client } from "@gradio/client";

// export async function runPrediction(clothBlob, modelBlob) {
//   try {
//     const client = await Client.connect("https://96b98dc6159e0761d8.gradio.live/");
//     const result = await client.predict("/run", {
//       cloth: clothBlob,
//       model: modelBlob,
//     });

//     return result.data; // This is the output image path or URL
//   } catch (error) {
//     console.error("Prediction error:", error);
//     return null;
//   }
// }
