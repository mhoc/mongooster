import {
  Document,
  Model,
  model,
  Schema,
  SchemaTypeOpts,
} from "mongoose";

export * from "mongoose";

export class Collection<T extends Document> {
  private model: Model<T>;

  constructor(collectionName: string, schema: Schema) {
    this.model = model<T>(collectionName, schema);
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
