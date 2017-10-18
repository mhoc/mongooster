import {
  Document,
} from "mongoose";

/** UpdateOp is a simplified and type-safe form of the object passed as the second
 *  paramter to a .update() operation.
 *  It is derived from the value of `this` inside the middleware 
 *  function, but is abstracted by this library to be easier to use.
 */
export interface UpdateOp {
  /** The _id of the updated document. This is always provided. */
  _id: any;
  /** If any $set operations were performed, that update object is provided here. */
  $set?: {
    [fieldPath: string]: any,
  };
};

/**
 * InsertMiddlewareFunc is the function signature that should be provided to 
 * preInsert and postInsert hooks.
 */
export interface InsertMiddlewareFunc<T> {
  (doc: T): Promise<void>;
}

/**
 * UpdateMiddlewareFunc is the function signature that should be provided to the 
 * preUpdate and postUpdate hooks. 
 */
export interface UpdateMiddlewareFunc<T> {
  (op: UpdateOp, doc?: T): Promise<void>;
}

export interface RemoveMiddlewareFunc<T> {
  (doc: T): Promise<void>;
}

/**
 * Options provided to the Middleware constructor.
 */
export interface MiddlewareOptions<T> {
  /**
   * If `true`, this wil cause all of your middleware to receive the optional 
   * `doc` argument, which is the document being operated upon. 
   * This has different behavior depending on the hook.
   *   preInsert: the value is ignored; the document is always provided with no performance penalty.
   *   postInsert: the value is ignored; the document is always provided with no performance penalty.
   *   preUpdate: the document delivered will be the document **before** the update.
   *   postUpdate: the document delivered will be the document **after** the update.
   *   preRemove:
   *   postRemove:
   */
  fetchDoc?: boolean;
  preInsert?: InsertMiddlewareFunc<T>;
  postInsert?: InsertMiddlewareFunc<T>;
  preUpdate?: UpdateMiddlewareFunc<T>;
  postUpdate?: UpdateMiddlewareFunc<T>;
  preRemove?: RemoveMiddlewareFunc<T>;
  postRemove?: RemoveMiddlewareFunc<T>;
}

/** Middleware is a class which makes creating middleware a bit more typesafe, 
 *  and allows you to provide functions that return a Promise instead of a 
 *  callback. 
 */
export class Middleware<T extends Document> {
  public fetchDoc: boolean;
  public preInsert?: InsertMiddlewareFunc<T>;
  public postInsert?: InsertMiddlewareFunc<T>;
  public preUpdate?: UpdateMiddlewareFunc<T>;
  public postUpdate?: UpdateMiddlewareFunc<T>;
  public preRemove?: RemoveMiddlewareFunc<T>;
  public postRemove?: RemoveMiddlewareFunc<T>;

  constructor(opts: MiddlewareOptions<T>) {
    this.fetchDoc = opts.fetchDoc ? true : false;
    this.preInsert = opts.preInsert;
    this.postInsert = opts.postInsert;
    this.preUpdate = opts.preUpdate;
    this.postUpdate = opts.postUpdate;
    this.preRemove = opts.preRemove;
    this.postRemove = opts.postRemove;
  }

}
