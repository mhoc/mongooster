/// <reference types="mongoose" />
import { Document, DocumentQuery } from "mongoose";
import { Middleware } from "./middleware";
import { Schema } from "./schema";
import { IVirtualDefs, Virtuals } from "./virtuals";
export interface CollectionOpts<T extends Document, V extends IVirtualDefs<T> = {}> {
    middleware?: Middleware<T>;
    virtuals?: Virtuals<T, V>;
}
export declare class Collection<T extends Document, V extends IVirtualDefs<T> = {}> {
    private middleware?;
    private model;
    private virtuals?;
    constructor(collectionName: string, schema: Schema, opts: CollectionOpts<T, V>);
    find(query: any): DocumentQuery<T[], T>;
    findOne(query: any): DocumentQuery<T | null, T>;
    findById(id: string): DocumentQuery<T | null, T>;
    /**
     * Perform a mongodb aggregate.
     * This can't reliably return T[] because aggregations can modify the format
     * the objects that are returned.
     */
    aggregate(aggregateSteps: object[]): Promise<object[]>;
    insert(document: T): Promise<T>;
    /** This is a horribly unperformant operation which updates every object the
     *  update requests in serial, one at a time. This is necessary in order to
     *  ensure that middleware is correctly called on each object you are updating.
     *
     *  However, this is the correct method to use if you need to update multiple
     *  documents, and the performance may be improved in a future release.
     */
    update(query: any, updateObj: object): Promise<T[]>;
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to update from .find(), you should just call .update() on that.
     *
     *  Note that if the query you provide returns more than one object, only the first
     *  returned from the query will be updated.
     */
    updateOne(query: any, updateObj: object): Promise<T>;
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to update from .find(), you should just call .update() on that.
     *  Note that this will do one additional thing for you; reject an error if
     *  the object you're trying to update doesn't exist.
     */
    updateById(id: string, updateObj: object): Promise<T>;
    /** This is a horribly unperformant operation which removes every object the
     *  remove op requests in serial, one at a time. This is necessary in order to
     *  ensure that middleware is correctly called on each object you are removing.
     *
     *  However, this is the correct method to use if you need to update multiple
     *  documents, and the performance may be improved in a future release.
     */
    remove(query: object): Promise<void>;
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to remove, you should just call .remove() on that.
     *  Note that this will do one additional thing for you; return an error
     *  if the object you're trying to remove doesn't exist.
     */
    removeOne(query: object): Promise<T>;
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to remove, you should just call .remove() on that.
     *  Note that this will do one additional thing for you; return an error
     *  if the object you're trying to remove doesn't exist.
     */
    removeById(id: string): Promise<T>;
}
