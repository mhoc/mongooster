"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class Collection {
    constructor(collectionName, schema, opts) {
        const self = this;
        const { middleware, virtuals } = opts;
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
                    if (this._update.$push) {
                        updateOp.$push = this._update.$push;
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
                    if (this._update.$push) {
                        updateOp.$push = this._update.$push;
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
        if (virtuals) {
            virtuals.forEach((v) => {
                schema.virtual(v.fieldName).get(v.getter);
            });
        }
        this.model = mongoose_1.model(collectionName, schema, collectionName);
    }
    find(query) {
        return this.model.find(query);
    }
    findOne(query) {
        return this.model.findOne(query);
    }
    findById(id) {
        return this.model.findById(id);
    }
    /**
     * Perform a mongodb aggregate.
     * This can't reliably return T[] because aggregations can modify the format
     * the objects that are returned.
     */
    aggregate(aggregateSteps) {
        return new Promise((res, rej) => {
            this.model.aggregate(...aggregateSteps, (err, result) => {
                if (err) {
                    return rej(err);
                }
                else {
                    return res(result);
                }
            });
        });
    }
    insert(document) {
        return new this.model(document).save();
    }
    /** This is a horribly unperformant operation which updates every object the
     *  update requests in serial, one at a time. This is necessary in order to
     *  ensure that middleware is correctly called on each object you are updating.
     *
     *  However, this is the correct method to use if you need to update multiple
     *  documents, and the performance may be improved in a future release.
     */
    update(query, updateObj) {
        return this.find(query)
            .then((docs) => {
            const promises = docs.map((doc) => {
                return doc.update(updateObj).then(() => Promise.resolve(doc)).catch((e) => Promise.reject(e));
            });
            return Promise.all(promises);
        });
    }
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to update from .find(), you should just call .update() on that.
     *
     *  Note that if the query you provide returns more than one object, only the first
     *  returned from the query will be updated.
     */
    updateOne(query, updateObj) {
        return this.findById(query)
            .then((doc) => {
            if (doc) {
                return doc.update(updateObj).exec();
            }
            else {
                return Promise.reject("document not found");
            }
        });
    }
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to update from .find(), you should just call .update() on that.
     *  Note that this will do one additional thing for you; reject an error if
     *  the object you're trying to update doesn't exist.
     */
    updateById(id, updateObj) {
        return this.findById(id)
            .then((doc) => {
            if (doc) {
                return doc.update(updateObj).exec();
            }
            else {
                return Promise.reject("document not found");
            }
        });
    }
    /** This is a horribly unperformant operation which removes every object the
     *  remove op requests in serial, one at a time. This is necessary in order to
     *  ensure that middleware is correctly called on each object you are removing.
     *
     *  However, this is the correct method to use if you need to update multiple
     *  documents, and the performance may be improved in a future release.
     */
    remove(query) {
        return this.find(query)
            .then((docs) => {
            const promises = docs.map((doc) => {
                return doc.remove().then(() => Promise.resolve()).catch((e) => Promise.reject(e));
            });
            return Promise.all(promises).then(() => Promise.resolve());
        });
    }
    /** This is a convenience method; if you already have an ODM instance of the
     *  object you want to remove, you should just call .remove() on that.
     *  Note that this will do one additional thing for you; return an error
     *  if the object you're trying to remove doesn't exist.
     */
    removeOne(query) {
        return this.findOne(query)
            .then((doc) => {
            if (doc) {
                return doc.remove();
            }
            else {
                return Promise.reject("document not found");
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