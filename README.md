# MONGOOSTER

This is a small helper library to make interfacing with mongoose a little bit easier.

## Example

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

Pretty simple.

Many of the types this exports are just aliases into mongoose itself, which is also provided as a dependency of this library (not a peerDependency) to make it easier to use.