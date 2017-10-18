"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class Collection {
    constructor(collectionName, schema, middleware) {
        const self = this;
        if (middleware) {
            if (middleware.preInsert) {
                schema = schema.pre("save", function (next) {
                    if (!middleware.preInsert)
                        throw `preInsert middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    middleware.preInsert(this).then(() => next()).catch(next);
                });
            }
            if (middleware.postInsert) {
                schema = schema.post("save", function (doc, next) {
                    if (!middleware.postInsert)
                        throw `postInsert middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    middleware.postInsert(this).then(() => next()).catch(next);
                });
            }
            if (middleware.preUpdate) {
                schema = schema.pre("update", function (next) {
                    if (!middleware.preUpdate)
                        throw `preUpdate middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    const updateOp = {
                        _id: this._conditions._id,
                    };
                    if (this._update.$set) {
                        updateOp.$set = this._update.$set;
                    }
                    if (middleware.fetchDoc && updateOp._id) {
                        self.findById(updateOp._id)
                            .then((doc) => {
                            return middleware.preUpdate(updateOp, doc);
                        })
                            .then(() => next())
                            .catch((err) => {
                            return next(err);
                        });
                    }
                    else {
                        middleware.preUpdate(updateOp, undefined).then(() => next()).catch(next);
                    }
                });
            }
            if (middleware.postUpdate) {
                schema = schema.post("update", function (commandResult, next) {
                    if (!middleware.postUpdate)
                        throw `postUpdate middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    const updateOp = {
                        _id: this._conditions._id,
                    };
                    if (this._update.$set) {
                        updateOp.$set = this._update.$set;
                    }
                    if (middleware.fetchDoc && updateOp._id) {
                        self.findById(updateOp._id)
                            .then((doc) => {
                            return middleware.postUpdate(updateOp, doc);
                        })
                            .then(() => next())
                            .catch((err) => {
                            return next(err);
                        });
                    }
                    else {
                        middleware.postUpdate(updateOp, undefined).then(() => next()).catch(next);
                    }
                });
            }
            if (middleware.preRemove) {
                schema = schema.pre("remove", function (next) {
                    if (!middleware.preRemove)
                        throw `preRemove middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    middleware.preRemove(this).then(() => next()).catch(next);
                });
            }
            if (middleware.postRemove) {
                schema = schema.post("remove", function (doc, next) {
                    if (!middleware.postRemove)
                        throw `postRemove middleware not found for ${collectionName}. this is likely a bug in mongooster`;
                    middleware.postRemove(this).then(() => next()).catch(next);
                });
            }
        }
        this.middleware = middleware;
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
     *  object you want to update from .find(), you should just call .update() on that.
     *  Note that this will do one additional thing for you; reject an error if
     *  the object you're trying to update doesn't exist.
     *
     *  At this time, we do not support batch updates. This is because
     *  mongoose doesn't fire validators or update hooks on batch updates; until we can
     *  engineer a solution around that, that functionality is not exposed.
     */
    updateById(id, updateObj) {
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
    removeById(id) {
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
//# sourceMappingURL=collection.js.map