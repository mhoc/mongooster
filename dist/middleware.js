"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
/** Middleware is a class which makes creating middleware a bit more typesafe,
 *  and allows you to provide functions that return a Promise instead of a
 *  callback.
 */
class Middleware {
    constructor(opts) {
        this.fetchDoc = opts.fetchDoc ? true : false;
        this.preInsert = opts.preInsert;
        this.postInsert = opts.postInsert;
        this.preUpdate = opts.preUpdate;
        this.postUpdate = opts.postUpdate;
        this.preRemove = opts.preRemove;
        this.postRemove = opts.postRemove;
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map