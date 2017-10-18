/// <reference types="mongoose" />
import { Schema as MongooseSchema, SchemaDefinition } from "mongoose";
/** This is identical to a mongoose.Schema, except that it automatically adds the
 *  _id:false option if an _id field is provided on the original schema object.
 *  This is useful for nesting subschemas which you dont want mongoose auto-adding
 *  an _id field, but it does mean you have to specify _id as a field on the
 *  root collection schema.
 */
export declare class Schema extends MongooseSchema {
    constructor(schema: SchemaDefinition);
}
