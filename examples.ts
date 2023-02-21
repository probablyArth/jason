import { Init, Model } from "@probablyarth/jason";

Init("exampleDb.json");

interface IUser {
  name?: string;
  age?: number;
  isPro?: boolean;
}
const User = new Model<IUser>("Users");

const id = User.insertOne({ name: "probablyarth", age: 17, isPro: true });
const user = User.findById(id);

User.commit();

User.insertMany([
  {
    name: "noob",
    age: 12,
    isPro: false,
  },
  {
    name: "small",
    isPro: false,
  },
]);

const allUsers = User.findMany({});
const noobUsers = User.findMany({ isPro: false });
