# MONGOOSTER

This is a small helper library to make interfacing with mongoose a little bit easier.

## Schemas

```ts
import { Collection, Default, Document, Optional, Required } from "mongooster";
import ulid from "ulid";

export interface IUser extends Document {
  _id: string;
  name: string;
  age?: number;
}

export const UserSchema = new Schema({
  _id: Default(String, ulid),
  name: Required(String),
  age: Optional(Number),
});

export const Users = new Collection<IUser>("users", UserSchema);
```

## Middleware

```ts
import { Collection, Default, Document, Optional, Required, UpdateOp } from "mongooster";
import ulid from "ulid";

export interface IUser extends Document {
  _id: string;
  name: string;
  age?: number;
}

export const UserSchema = new Schema({
  _id: Default(String, ulid),
  name: Required(String),
  age: Optional(Number),
});

export const middleware = new Middleware<IUser>({
  fetchDoc: true,

  postUpdate: (op: UpdateOp, doc?: IUser): Promise<any> => {
    console.log("Updated user!");
    console.log("if fetchDoc: false, doc will be undefined!");
    console.log("setting it to true is handy, but comes with the performance penalty of an additional database read.");
    return Promise.resolve();
  },

})

export const Users = new Collection<IUser>("users", UserSchema, middleware);
```