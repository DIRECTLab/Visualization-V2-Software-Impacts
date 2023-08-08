# Prep

Run `npm install --include=dev` to install dependencies

# Setting up the database

If postgres is not installed on the machine, follow instructions to get the database installed and setup.

If you already have postgres, you will need to make a new database:

[https://www.postgresql.org/docs/current/tutorial-createdb.html](https://www.postgresql.org/docs/current/tutorial-createdb.html)

Make note of your database name you create, and make note of your username and password.

Create a file called `.env`, and use the `.env.example` for the structure. You will need to replace any parts in `<fill in xyz>`. The .env is not committed to git, so you don't have to worry about committing your password for it (although don't use your bank one haha)

## Examples

There are a few example folders that show how to make a model, how to make routes, and how to make migrations. Each should show how everything works, but talk to Taylor if there's anything really weird that doesn't make sense.

## Creating models

If there's not already a folder that makes sense to make the model in, create a new one for it.

Create a file in the folder called `<modelname>.js`. Use this skeleton and replace `<modelname>` with your actual model name. I like keeping the modelname as Upper Camelcase for consistency, but as long as you're consistent it doesn't matter.

```js
const Sequelize = require('sequelize');

const modelName = '<modelname>';
module.exports = sequelize => ({
    modelName,
    associate: () => {
    },
    model: sequelize
        .define(modelName, {
        },
        {
            freezeTableName: true,
            tableName: modelName,
        }),
});
```

To break down the parts a bit, the associate part is a function that lets you define the associations between this model and others, (see example model for what that might look like).

The next part, the empty object in define, is where you define your columns. Once again, check out the example model for what that might look like, and see Sequelize documentation for the various types available.

## Creating routes

The simplist route you can create is shown in the `routes/example/index.js`. For more complex routes, see the example.md in that folder. Anytime you add a new folder to the `routes` folder, make sure to update the `routes/index.js` to add it as a valid path.

### Migrating the database

Migration scripts have all been setup already. Just run:

```sh
npx sequelize db:migrate
```

To undo the migrations, you will just run:

```sh
npx sequelize db:migrate:undo
```

## Setup Auth (for signing the JWT's)

* Run `ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key` and leave the passphrase blank
* Run `openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub`
* Rename outputted files to `public.key` and `private.key`
* Move to both `src/auth/`
