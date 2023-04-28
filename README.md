# See the vibe

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Set up firebase
Create a firebase project and set up the following:

Functions, hosting, storage and authentication

- Go to https://console.firebase.google.com/ and create a new project
- Go to build -> authentication -> sign-in method and choose Email/Password, create a user and password
- Go to build -> storage and enable storage
    - setup the ability for your functions to write to storage using the instructions [here](https://stackoverflow.com/questions/53143965/uploading-files-from-firebase-cloud-functions-to-cloud-storage).
    - setup cors via `gsutils` 
- In Firebase, go to Project Overview -> click the project name -> click the settings icon to go to project settings. 
- In Project Settings, copy (or create and copy) the configuration data in the curly braces (including the curly braces). 
- In `src/firebase`, create a file called `creds.ts` and paste the configuration data into the file.
```typescript
export const firebaseConfig = {
    apiKey: "xxx",
    authDomain: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx",
    measurementId: "xxx"
};
```
- Open a new terminal from the root directory of your repo in VSCode, type `firebase login` to log in from the terminal 
- In terminal, type `firebase init` and select the id of the project you just made
    -  Choose to set up hosting, functions already exist in the repo (but you will be using them), do not set up github actions

Set your OpenAI API key in firebase
- Type `firebase functions:config:set openai.key="THE API KEY"` in the terminal
- Type `firebase functions:config:set openai.org="THE ORG ID"` in the terminal
- In terminal, go to `/functions` using `cd functions` from your root directory
- Type `firebase functions:config:get > .runtimeconfig.json` in the terminal
- In `.runtimeconfig.json` file, you should see this:
```jSON
{
  "openai": {
    "key": "YOUR OPENAI API KEY",
    "org": "YOUR OPENAI ORG"
  }
}
```


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
