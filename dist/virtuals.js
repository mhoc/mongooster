"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A single virtual definition.
 *   <T, R>
 *   - T: The base type of the collection the virtual is available on.
 *   - R: The return type of your virtual function, which is the same as the type
 *        of the field the virtual corresponds to.
 */
class Virtual {
    constructor(fieldName, getter) {
        this.fieldName = fieldName;
        this.rawGetter = getter;
        this.getter = function () {
            const doc = this;
            return getter(doc);
        };
    }
}
exports.Virtual = Virtual;
//# sourceMappingURL=virtuals.js.map