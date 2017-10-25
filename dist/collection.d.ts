/// <reference types="mongoose" />
import { Document, DocumentQuery } from "mongoose";
import { Middleware } from "./middleware";
import { Schema } from "./schema";
import { Virtual } from "./virtuals";
export interface CollectionOpts<T extends Document> {
    middleware?: Middleware<T>;
    virtuals?: Virtual<T, any>[];
}
export declare class Collection<T extends Document> {
    private middleware?;
    private model;
    constructor(collectionName: string, schema: Schema, opts: CollectionOpts<T>);
    find(query: any): DocumentQuery<T[], T>;
    findOne(query: any): DocumentQuery<T | null, T>;
    findById(id: string): DocumentQuery<T | null, T>;
    insert(document: T): Promise<T>;
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to update from .find(), you should just call .update() on that.
     *  Note that this will do one additional thing for you; reject an error if
     *  the object you're trying to update doesn't exist.
     *
     *  At this time, we do not support batch updates. This is because
     *  mongoose doesn't fire validators or update hooks on batch updates; until we can
     *  engineer a solution around that, that functionality is not exposed.
     */
    updateById(id: string, updateObj: object): Promise<T>;
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to remove, you should just call .remove() on that.
     *  Note that this will do one additional thing for you; return an error
     *  if the object you're trying to remove doesn't exist.
     */
    removeById(id: string): Promise<T>;
}
