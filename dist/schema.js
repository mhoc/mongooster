"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
//# sourceMappingURL=schema.js.map