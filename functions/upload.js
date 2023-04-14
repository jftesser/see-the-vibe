var serviceAccount = require("./see-the-vibe-firebase-adminsdk-bq6an-0f37f5f2c0.json")

const functions = require('firebase-functions')
const admin = require('firebase-admin')    

// you also have to install gsutils and set cors on your bucket
// gcloud auth login
// gcloud config set project see-the-vibe
// gsutil cors set cors.json gs://see-the-vibe.appspot.com

admin.initializeApp({
    projectId: serviceAccount.project_id, 
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://see-the-vibe.appspot.com",
    storageBucket: "see-the-vibe.appspot.com"
  });

exports.uploadImage = async (imageBytes64Str, name) => {

    const bucket = admin.storage().bucket()
    const imageBuffer = Buffer.from(imageBytes64Str, 'base64')
    const imageByteArray = new Uint8Array(imageBuffer);
    const file = bucket.file(`${name}.png`);
    const options = { resumable: false, metadata: { contentType: "image/png" } }

    //options may not be necessary
    return file.save(imageByteArray, options)
    .then(stuff => {
        return file.getSignedUrl({
            action: 'read',
            expires: '03-09-2500'
          })
    })
    .then(urls => {
        const url = urls[0];
        console.log(`Image url = ${url}`)
        return url
    })
    .catch(err => {
        console.log(`Unable to upload image ${err}`)
    })
}