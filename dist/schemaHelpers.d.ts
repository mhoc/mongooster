/// <reference types="mongoose" />
import { SchemaTypeOpts } from "mongoose";
export declare function Default(schema: any, defaultValue: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
export declare function DefaultEnum(allowedValues: string[], defaultValue: string, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
export declare function Optional(schema: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
export declare function OptionalEnum(allowedValues: string[], opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
export declare function Required(schema: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
export declare function RequiredEnum(allowedValues: string[], opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any>;
