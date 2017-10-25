import {
  Document,
  DocumentQuery,
  Model,
  model,
  Query,
} from "mongoose";

import { Middleware, UpdateOp } from "./middleware";
import { Schema } from "./schema";
import { Virtual } from "./virtuals";

export interface CollectionOpts<T extends Document> {
  middleware?: Middleware<T>;
  virtuals?: Virtual<T, any>[];
}

export class Collection<T extends Document> {
  private middleware?: Middleware<T>;
  private model: Model<T>;

  constructor(collectionName: string, schema: Schema, opts: CollectionOpts<T>) {
    const self = this;
    const { middleware, virtuals } = opts;
    if (middleware) {
      if (middleware.preInsert) {
        schema = schema.pre("save", function(this: T, next: (err?: Error) => void) {
          if (!middleware.preInsert) throw `preInsert middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          middleware.preInsert(this).then(() => next()).catch(next);
        });
      }
      if (middleware.postInsert) {
        schema = schema.post("save", function(this: T, doc: T, next: (err?: Error) => void) {
          if (!middleware.postInsert) throw `postInsert middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          middleware.postInsert(this).then(() => next()).catch(next);
        });
      }
      if (middleware.preUpdate) {
        schema = schema.pre("update", function(this: any, next: (err?: Error) => void) {
          if (!middleware.preUpdate) throw `preUpdate middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          const updateOp: UpdateOp = {
            _id: this._conditions._id,
          };
          if (this._update.$set) {
            updateOp.$set = this._update.$set;
          }
          if (middleware.fetchDoc && updateOp._id) {
            self.findById(updateOp._id)
              .then((doc) => {
                return (middleware.preUpdate as Function)(updateOp, doc);
              })
              .then(() => next())
              .catch((err) => {
                return next(err);
              })
          } else {
            middleware.preUpdate(updateOp, undefined).then(() => next()).catch(next);
          }
        });
      }
      if (middleware.postUpdate) {
        schema = schema.post("update", function(this: any, commandResult: any, next: (err?: Error) => void) {
          if (!middleware.postUpdate) throw `postUpdate middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          const updateOp: UpdateOp = {
            _id: this._conditions._id,
          };
          if (this._update.$set) {
            updateOp.$set = this._update.$set;
          }
          if (middleware.fetchDoc && updateOp._id) {
            self.findById(updateOp._id)
              .then((doc) => {
                return (middleware.postUpdate as Function)(updateOp, doc);
              })
              .then(() => next())
              .catch((err) => {
                return next(err);
              })
          } else {
            middleware.postUpdate(updateOp, undefined).then(() => next()).catch(next);
          }
        });
      }
      if (middleware.preRemove) {
        schema = schema.pre("remove", function(this: T, next: (err?: Error) => void) {
          if (!middleware.preRemove) throw `preRemove middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          middleware.preRemove(this).then(() => next()).catch(next);
        });
      }
      if (middleware.postRemove) {
        schema = schema.post("remove", function(this: T, doc: T, next: (err?: Error) => void) {
          if (!middleware.postRemove) throw `postRemove middleware not found for ${collectionName}. this is likely a bug in mongooster`;
          middleware.postRemove(this).then(() => next()).catch(next);
        });
      }
    }
    this.middleware = middleware;
    if (virtuals) {
      virtuals.forEach((v) => {
        schema.virtual(v.fieldName).get(v.getter);
      });
    }
    this.model = model<T>(collectionName, schema, collectionName);
  }

  public find(query: any): DocumentQuery<T[], T> {
    return this.model.find(query);
  }

  public findOne(query: any): DocumentQuery<T | null, T> {
    return this.model.findOne(query);
  }

  public findById(id: string): DocumentQuery<T | null, T> {
    return this.model.findById(id);
  }

  public insert(document: T): Promise<T> {
    return new this.model(document).save();
  }

  /** This is a convenience method; if you already have an ODM instance of the
   *  object you want to update from .find(), you should just call .update() on that.
   *  Note that this will do one additional thing for you; reject an error if
   *  the object you're trying to update doesn't exist.
   *
   *  At this time, we do not support batch updates. This is because
   *  mongoose doesn't fire validators or update hooks on batch updates; until we can
   *  engineer a solution around that, that functionality is not exposed.
   */
  public updateById(id: string, updateObj: object): Promise<T> {
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
  public removeById(id: string): Promise<T> {
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
