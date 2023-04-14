const functions = require("firebase-functions");
const openai = require("./openai");
const { uploadImage } = require("./upload");
const crypto = require("crypto");

exports.getImage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }
  const prompt = data;
  const blob = await openai.getDalle(prompt);
  const url = await uploadImage(blob, crypto.randomUUID());
  return url;
});

exports.getVariant = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }
  
  const base_blob = data;
  const blob = await openai.getVariation(base_blob);
  if (blob) {
    const url = await uploadImage(blob, crypto.randomUUID());
    return url;
  }
  return null;
});
