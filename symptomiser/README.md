## Starting the app locally

So far, the app is only ready to run locally.

You'll need to install mongoDB locally for that.

You first need to start the translator API.

Afterwards, you have to start the api running the following code in ./symptomiser-api

```
node .
```

Finally, you have to start the app running the following code in ./symptomiser-app

```
npm start
```

The MongoDB and translator API urls are in the .env in ./symptomiser-api
The API url is in the .env in ./symptomiser-app
