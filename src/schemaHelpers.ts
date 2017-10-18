import {
  SchemaTypeOpts,
} from "mongoose";

export function Default(schema: any, defaultValue: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.default = defaultValue;
  opts.type = schema;
  return opts;
}

export function DefaultEnum(
  allowedValues: string[],
  defaultValue: string,
  opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.default = defaultValue;
  opts.enum = allowedValues;
  opts.required = false;
  opts.type = String;
  return opts;
}

export function Optional(schema: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.type = schema;
  return opts;
}

export function OptionalEnum(allowedValues: string[], opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.enum = allowedValues;
  opts.required = false;
  opts.type = String;
  return opts;
}

export function Required(schema: any, opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.required = true;
  opts.type = schema;
  return opts;
}

export function RequiredEnum(allowedValues: string[], opts?: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
  if (!opts) {
    opts = {};
  }
  opts.enum = allowedValues;
  opts.required = true;
  opts.type = String;
  return opts;
}
