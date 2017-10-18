"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Default(schema, defaultValue, opts) {
    if (!opts) {
        opts = {};
    }
    opts.default = defaultValue;
    opts.type = schema;
    return opts;
}
exports.Default = Default;
function DefaultEnum(allowedValues, defaultValue, opts) {
    if (!opts) {
        opts = {};
    }
    opts.default = defaultValue;
    opts.enum = allowedValues;
    opts.required = false;
    opts.type = String;
    return opts;
}
exports.DefaultEnum = DefaultEnum;
function Optional(schema, opts) {
    if (!opts) {
        opts = {};
    }
    opts.type = schema;
    return opts;
}
exports.Optional = Optional;
function OptionalEnum(allowedValues, opts) {
    if (!opts) {
        opts = {};
    }
    opts.enum = allowedValues;
    opts.required = false;
    opts.type = String;
    return opts;
}
exports.OptionalEnum = OptionalEnum;
function Required(schema, opts) {
    if (!opts) {
        opts = {};
    }
    opts.required = true;
    opts.type = schema;
    return opts;
}
exports.Required = Required;
function RequiredEnum(allowedValues, opts) {
    if (!opts) {
        opts = {};
    }
    opts.enum = allowedValues;
    opts.required = true;
    opts.type = String;
    return opts;
}
exports.RequiredEnum = RequiredEnum;
//# sourceMappingURL=schemaHelpers.js.map