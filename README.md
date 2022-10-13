# General info

MERN stack simple todo list
College M.E.R.N. task management application, with [Mantine UI](https://mantine.dev/)

This project aims to demonstrate the JWT authentication and authorization

## Setup

### Front-End(client)

```
$ cd ../client
$ npm install
$ npm start
```
OR
```
$ cd ../client
$ yarn install
yarn start
```

### Back-End(server)

```
$ cd ../server
$ npm i mongoose
$ npm install update
$ npm run dev

```

OR

```
$ cd ../server
$ yarn add mongoose
$ yarn run dev
```

Additionally, in order to run the server, you need to create a .env file in the cmd/powershell or terminal
by typing:

#### For Windows `echo > .env`

#### For mac/linux `touch .env`

Now type inside the .env file

- The port number as `PORT = {port number}`
- The link to connect with the MongoDB Atlas as `MONGO_CONN = mongodb+srv://<username>:<password>@cluster0.jnw32.mongodb.net/<Database Name>?retryWrites=true&w=majority`
- The signature key as `JWT_KEY= <your signature key>`

Or just check the .env_sample, copy all, then change the needed fields

---

**NOTE**

As for the signature key, you can find random signature keys generators online and use the 256-bit key.
An example is "https://randomkeygen.com/" or "https://keygen.io/"

---
