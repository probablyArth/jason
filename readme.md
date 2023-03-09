# Jason

A simple typesafe JSON ORM library that allows you to interact with data stored in a JSON database. The library provides a simple ORM-like interface for working with data.

## Installation

- npm

```bash
npm install @probablyarth/jason
```

- yarn

```bash
yarn add @probablyarth/json
```

## Usage

Here is an example of how to use the library

```typescript
import { Init, Model } from "@probablyarth/jason";

Init("path/to/database.json");

interface IUser {
  name: string;
  age: number;
}

const userModel = new Model<IUser>("users");

const userId = userModel.insertOne({
  name: "probablyarth",
  age: 17,
});

const user = userModel.findById(userId);

console.log(user);
```

You can also use it without types,

```javascript
import { Init, Model } from "@probablyarth/jason";

Init("path/to/database.json");

const userModel = new Model("users");

const userId = userModel.insertOne({
  name: "probablyarth",
  age: 17,
});

const user = userModel.findById(userId);

console.log(user);
```

More examples in the [examples folder](https://github.com/probablyArth/jason/blob/main/examples.ts)

## Disclaimer

Json files should not be used as database for projects that store huge amounts of data. Although a json file of 1mb should be able to hold about 5-10k records (depends on the size of records).
All the data is loaded in the memory temporarily but this shouldn't be any problem either when working with small projects or projects that require DB to be hosted locally.

## Motivation

I was working on a side project which needed a database to be hosted locally by the user. It would be a very big hassle for the end user if he had to setup mongodb or mysql on his pc to use that project and the data won't be that much either so there was no point in setting up a traditional dbms. I wanted a lighter and simpler solution, that's when I thought about json files.

<a href="https://www.buymeacoffee.com/probablyarth" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## TODO

- Better Queries, perhaps a queryBuilder?
- Docs? Maybe
