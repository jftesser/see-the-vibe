const { Configuration, OpenAIApi } = require("openai");
const functions = require("firebase-functions");
const _ = require("lodash");

const configuration = new Configuration({
  apiKey: functions.config().openai.key,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async getDalle(msg, reaction = "") {
    console.log("Getting DALL-E with prompt: " + msg);
    const response = await openai.createImage({
      prompt: msg,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });
    //functions.logger.info(response.data)
    const blob = response.data.data[0].b64_json;
    return blob;
  },
  async getVariation(blob) {
    // convert to buffer
    const buff = Buffer.from(blob, "base64");
    // add enough metadata to make openai happy
    buff.name = "image.png";
    // request a variation
    const response = await openai.createImageVariation(
      buff,
      1,
      "512x512",
      "b64_json"
    );
    // pass back the new blob
    const image_url = response.data.data[0].b64_json;
    return image_url;
  },
};
