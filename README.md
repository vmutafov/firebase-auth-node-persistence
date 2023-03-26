# Firebase  Auth NodeJS Persistence

[![npm version](https://badge.fury.io/js/@vmutafov%2Ffirebase-auth-node-persistence.svg)](https://badge.fury.io/js/@vmutafov%2Ffirebase-auth-node-persistence)


## What?
This library is a simple file-based [Firebase Auth](https://firebase.google.com/docs/auth) NodeJS persistence provider. The idea behind it is that at the time of writing, [Firebase's client SDK](https://www.npmjs.com/package/firebase) does not have persistent authentication storage when running in NodeJS - it only has an in-memory one. This is quite different from its usage in the browser where the Local Storage, Session Storage, or IndexedDB could be used.

## Why?
There are use cases where having persistent authentication may be necessary for NodeJS applications:
- having a CLI application where you want users to log in via dedicated command and not to be prompted on every next command to log in, e.g. the Firebase CLI where you log in once and you are not required to log in on each command
- transferring your authenticated user to another machine or another NodeJS process

## How?
First, install the library:
```
npm i @vmutafov/firebase-auth-node-persistence
```
After that, you only need to initialize the Firebase Auth and explicitly set the persistence:
```TypeScript
import { getApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { createNodeFilePersistence } from "@vmutafov/firebase-auth-node-persistence";
import { resolve } from "node:path";
import { cwd } from "node:process";

const app = getApp();

const nodeFilePersistence = createNodeFilePersistence({
    filePath: resolve(cwd(), '.authrc')
});

const auth = initializeAuth(app, {
    persistence: [nodeFilePersistence]
});
```

Setting the `filePath` property of the configuration options for the `createNodeFilePersistence` function allows you to specify a file that would be used for storing the authentication data.