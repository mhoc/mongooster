/// <reference types="mongoose" />
import { Document, Schema, SchemaTypeOpts } from "mongoose";
export * from "mongoose";
export declare class Collection<T extends Document> {
    private model;
    constructor(collectionName: string, schema: Schema);
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
