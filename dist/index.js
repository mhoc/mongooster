"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
__export(require("mongoose"));
/** This is identical to a mongoose.Schema, except that it automatically adds the
 *  _id:false option if an _id field is provided on the original schema object.
 *  This is useful for nesting subschemas which you dont want mongoose auto-adding
 *  an _id field, but it does mean you have to specify _id as a field on the
 *  root collection schema.
 */
class Schema extends mongoose_1.Schema {
    constructor(schema) {
        const opts = {};
        if (!schema._id) {
            opts._id = false;
        }
        super(schema, opts);
    }
}
exports.Schema = Schema;
/** Middleware is a class which makes creating middleware a bit more typesafe,
 *  and allows you to provide functions that return a Promise instead of a
 *  callback.
 */
class Middleware {
    constructor(hooks) {
        this.preInsert = hooks.preInsert;
        this.postInsert = hooks.postInsert;
        this.preUpdate = hooks.preUpdate;
        this.postUpdate = hooks.postUpdate;
        this.preRemove = hooks.preRemove;
        this.postRemove = hooks.postRemove;
    }
}
exports.Middleware = Middleware;
class Collection {
    constructor(collectionName, schema, middleware) {
        if (middleware) {
            if (middleware.preInsert) {
                schema = schema.pre("save", (next) => {
                    if (!middleware.preInsert)
                        throw `preInsert middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    middleware.preInsert().then(() => next()).catch(next);
                });
            }
            if (middleware.postInsert) {
                schema = schema.post("save", (doc, next) => {
                    if (!middleware.postInsert)
                        throw `postInsert middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    middleware.postInsert(doc).then(() => next()).catch(next);
                });
            }
            if (middleware.preUpdate) {
                schema = schema.pre("update", (next) => {
                    if (!middleware.preUpdate)
                        throw `preUpdate middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    middleware.preUpdate().then(() => next()).catch(next);
                });
            }
            if (middleware.postUpdate) {
                schema = schema.post("update", (doc, next) => {
                    if (!middleware.postUpdate)
                        throw `postUpdate middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    middleware.postUpdate(doc).then(() => next()).catch(next);
                });
            }
            if (middleware.preRemove) {
                schema = schema.pre("remove", (next) => {
                    if (!middleware.preRemove)
                        throw `preRemove middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    middleware.preRemove().then(() => next()).catch(next);
                });
            }
            if (middleware.postRemove) {
                schema = schema.post("remove", (doc, next) => {
                    if (!middleware.postRemove)
                        throw `postRemove middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    middleware.postRemove(doc).then(() => next()).catch(next);
                });
            }
        }
        this.model = mongoose_1.model(collectionName, schema, collectionName);
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