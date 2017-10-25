/// <reference types="mongoose" />
import { Document } from "mongoose";
/**
 * A single virtual definition.
 *   <T, R>
 *   - T: The base type of the collection the virtual is available on.
 *   - R: The return type of your virtual function, which is the same as the type
 *        of the field the virtual corresponds to.
 */
export declare class Virtual<T extends Document, R> {
    fieldName: string;
    getter: () => R;
    rawGetter: (base: T) => R;
    constructor(fieldName: string, getter: (doc: T) => R);
}
