import { Document } from "mongoose";

export type IVirtualDef<T extends Document, R> = (doc: T) => R;

export interface IVirtualDefs<T extends Document> {
  [fieldName: string]: IVirtualDef<T, any>
}

export class Virtuals<D extends Document, T extends IVirtualDefs<D>> {
  public defs: T;
  constructor(defs: T) {
    this.defs = defs;
  }
}
