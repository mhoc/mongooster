import { Document } from "mongoose";

/**
 * A single virtual definition. 
 *   <T, R>
 *   - T: The base type of the collection the virtual is available on.
 *   - R: The return type of your virtual function, which is the same as the type
 *        of the field the virtual corresponds to.
 */
export class Virtual<T extends Document, R> {
  public fieldName: string;
  public getter: () => R;
  public rawGetter: (base: T) => R;

  constructor(fieldName: string, getter: (doc: T) => R) {
    this.fieldName = fieldName;
    this.rawGetter = getter;
    this.getter = function(this: T): R {
      const doc = this;
      return getter(doc);
    };
  }
}
