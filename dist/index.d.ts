/// <reference types="mongoose" />
import { Document, Schema as MongooseSchema, SchemaDefinition, SchemaTypeOpts } from "mongoose";
export * from "mongoose";
/** This is identical to a mongoose.Schema, except that it automatically adds the
 *  _id:false option if an _id field is provided on the original schema object.
 *  This is useful for nesting subschemas which you dont want mongoose auto-adding
 *  an _id field, but it does mean you have to specify _id as a field on the
 *  root collection schema.
 */
export declare class Schema extends MongooseSchema {
    constructor(schema: SchemaDefinition);
}
/** Middleware is a class which makes creating middleware a bit more typesafe,
 *  and allows you to provide functions that return a Promise instead of a
 *  callback.
 */
export declare class Middleware<T extends Document> {
    preInsert?: () => Promise<void>;
    postInsert?: (doc: T) => Promise<void>;
    preUpdate?: () => Promise<void>;
    postUpdate?: (doc: T) => Promise<void>;
    preRemove?: () => Promise<void>;
    postRemove?: (doc: T) => Promise<void>;
    constructor(hooks: {
        preInsert?: () => Promise<void>;
        postInsert?: (doc: T) => Promise<void>;
        preUpdate?: () => Promise<void>;
        postUpdate?: (doc: T) => Promise<void>;
        preRemove?: () => Promise<void>;
        postRemove?: (doc: T) => Promise<void>;
    });
}
export declare class Collection<T extends Document> {
    private model;
    constructor(collectionName: string, schema: Schema, middleware?: Middleware<T>);
    find(query: any): Promise<T[]>;
    findOne(query: any): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    insert(document: T): Promise<T>;
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to update, you should just call .update() on that.
     *  Note that this will do one additional thing for you; return an error if
     *  the object you're trying to update doesn't exist.
     *
     *  At this time, we do not support batch updates. This is because
     *  mongoose doesn't fire validators or update hooks on batch updates; until we can
     *  engineer a solution around that, that functionality is not exposed.
     */
    updateOne(id: string, updateObj: object): Promise<T>;
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to remove, you should just call .remove() on that.
     *  Note that this will do one additional thing for you; return an error
     *  if the object you're trying to remove doesn't exist.
     */
    removeOne(id: string): Promise<T>;
}
export declare function Default(schema: any, defaultValue: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
export declare function DefaultEnum(allowedValues: string[], defaultValue: string, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
export declare function Optional(schema: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
export declare function OptionalEnum(allowedValues: string[], opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
export declare function Required(schema: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
export declare function RequiredEnum(allowedValues: string[], opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
