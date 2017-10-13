"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class Collection {
    constructor(collectionName, schema) {
        this.model = mongoose_1.model(collectionName, schema);
    }
    find(query) {
        return this.model.find(query).exec();
    }
    findOne(query) {
        return this.model.findOne(query).exec();
    }
    findById(id) {
        return this.model.findById(id).exec();
    }
    insert(document) {
        return new this.model(document).save();
    }
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to update, you should just call .update() on that.
     *  Note that this will do one additional thing for you; return an error if
     *  the object you're trying to update doesn't exist.
     *
     *  At this time, we do not support batch updates. This is because
     *  mongoose doesn't fire validators or update hooks on batch updates; until we can
     *  engineer a solution around that, that functionality is not exposed.
     */
    updateOne(id, updateObj) {
        return this.findById(id)
            .then((doc) => {
            if (!doc) {
                return Promise.reject("document not found");
            }
            else {
                return doc.update(updateObj).exec();
            }
        });
    }
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to remove, you should just call .remove() on that.
     *  Note that this will do one additional thing for you; return an error
     *  if the object you're trying to remove doesn't exist.
     */
    removeOne(id) {
        return this.findById(id)
            .then((doc) => {
            if (!doc) {
                return Promise.reject("document not found");
            }
            else {
                return doc.remove();
            }
        });
    }
}
exports.Collection = Collection;
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
//# sourceMappingURL=index.js.map