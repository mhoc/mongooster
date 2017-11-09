/// <reference types="mongoose" />
import { Document } from "mongoose";
export declare type IVirtualDef<T extends Document, R> = (doc: T) => R;
export interface IVirtualDefs<T extends Document> {
    [fieldName: string]: IVirtualDef<T, any>;
}
export declare class Virtuals<D extends Document, T extends IVirtualDefs<D>> {
    defs: T;
    constructor(defs: T);
}
