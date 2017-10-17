import {
  Document,
  Model,
  model,
  Schema as MongooseSchema,
  SchemaDefinition,
  SchemaOptions,
  SchemaTypeOpts,
} from "mongoose";

export * from "mongoose";

/** This is identical to a mongoose.Schema, except that it automatically adds the 
 *  _id:false option if an _id field is provided on the original schema object. 
 *  This is useful for nesting subschemas which you dont want mongoose auto-adding 
 *  an _id field, but it does mean you have to specify _id as a field on the 
 *  root collection schema.
 */
export class Schema extends MongooseSchema {

  constructor(schema: SchemaDefinition) {
    const opts: SchemaOptions = {};
    if (!schema._id) {
      opts._id = false;
    }
    super(schema, opts);
  }

}

/** Middleware is a class which makes creating middleware a bit more typesafe, 
 *  and allows you to provide functions that return a Promise instead of a 
 *  callback. 
 */
export class Middleware<T extends Document> {
  public preInsert?: () => Promise<void>;
  public postInsert?: (doc: T) => Promise<void>;
  public preUpdate?: () => Promise<void>;
  public postUpdate?: (doc: T) => Promise<void>;
  public preRemove?: () => Promise<void>;
  public postRemove?: (doc: T) => Promise<void>;

  constructor(hooks: {
    preInsert?: () => Promise<void>;
    postInsert?: (doc: T) => Promise<void>;
    preUpdate?: () => Promise<void>;
    postUpdate?: (doc: T) => Promise<void>;
    preRemove?: () => Promise<void>;
    postRemove?: (doc: T) => Promise<void>;
  }) {
    this.preInsert = hooks.preInsert;
    this.postInsert = hooks.postInsert;
    this.preUpdate = hooks.preUpdate;
    this.postUpdate = hooks.postUpdate;
    this.preRemove = hooks.preRemove;
    this.postRemove = hooks.postRemove;
  }

}

export class Collection<T extends Document> {
  private model: Model<T>;

  constructor(collectionName: string, schema: Schema, middleware?: Middleware<T>) {
    if (middleware) {
      if (middleware.preInsert) {
        schema = schema.pre("save", (next: (err?: Error) => void) => {
          if (!middleware.preInsert) throw `preInsert middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          middleware.preInsert().then(() => next()).catch(next);
        });
      }
      if (middleware.postInsert) {
        schema = schema.post("save", (doc: T, next: (err?: Error) => void) => {
          if (!middleware.postInsert) throw `postInsert middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          middleware.postInsert(doc).then(() => next()).catch(next);
        });
      }
      if (middleware.preUpdate) {
        schema = schema.pre("update", (next: (err?: Error) => void) => {
          if (!middleware.preUpdate) throw `preUpdate middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          middleware.preUpdate().then(() => next()).catch(next);
        });
      }
      if (middleware.postUpdate) {
        schema = schema.post("update", (doc: T, next: (err?: Error) => void) => {
          if (!middleware.postUpdate) throw `postUpdate middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          middleware.postUpdate(doc).then(() => next()).catch(next);
        });
      }
      if (middleware.preRemove) {
        schema = schema.pre("remove", (next: (err?: Error) => void) => {
          if (!middleware.preRemove) throw `preRemove middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          middleware.preRemove().then(() => next()).catch(next);
        });
      }
      if (middleware.postRemove) {
        schema = schema.post("remove", (doc: T, next: (err?: Error) => void) => {
          if (!middleware.postRemove) throw `postRemove middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          middleware.postRemove(doc).then(() => next()).catch(next);
        });
      }
    }
    this.model = model<T>(collectionName, schema, collectionName);
  }

  public find(query: any): Promise<T[]> {
    return this.model.find(query).exec();
  }

  public findOne(query: any): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  public findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  public insert(document: T): Promise<T> {
    return new this.model(document).save();
  }

  /** This is a convenience method; if you already have an ODM instance of the
   *  object you want to update, you should just call .update() on that.
   *  Note that this will do one additional thing for you; return an error if
   *  the object you're trying to update doesn't exist.
   *
   *  At this time, we do not support batch updates. This is because
   *  mongoose doesn't fire validators or update hooks on batch updates; until we can
   *  engineer a solution around that, that functionality is not exposed.
   */
  public updateOne(id: string, updateObj: object): Promise<T> {
    return this.findById(id)
      .then((doc) => {
        if (!doc) {
          return Promise.reject("document not found");
        } else {
          return doc.update(updateObj).exec();
        }
      });
  }

  /** This is a convenience method; if you already have an ODM instance of the
   *  object you want to remove, you should just call .remove() on that.
   *  Note that this will do one additional thing for you; return an error
   *  if the object you're trying to remove doesn't exist.
   */
  public removeOne(id: string): Promise<T> {
    return this.findById(id)
      .then((doc) => {
        if (!doc) {
          return Promise.reject("document not found");
        } else {
          return doc.remove();
        }
      });
  }

}

export function Default(schema: any, defaultValue: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.default = defaultValue;
  opts.type = schema;
  return opts;
}

export function DefaultEnum(
  allowedValues: string[],
  defaultValue: string,
  opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.default = defaultValue;
  opts.enum = allowedValues;
  opts.required = false;
  opts.type = String;
  return opts;
}

export function Optional(schema: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.type = schema;
  return opts;
}

export function OptionalEnum(allowedValues: string[], opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.enum = allowedValues;
  opts.required = false;
  opts.type = String;
  return opts;
}

export function Required(schema: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.required = true;
  opts.type = schema;
  return opts;
}

export function RequiredEnum(allowedValues: string[], opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.enum = allowedValues;
  opts.required = true;
  opts.type = String;
  return opts;
}
