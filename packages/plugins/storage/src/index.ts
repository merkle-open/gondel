import { Adapter, IStorage, ISerializer } from "./Adapter";
import { storage, setDefaultStorageAdapter } from "./StorageDecorator";
import BooleanSerializer from "./serializer/Boolean";
import NumberSerializer from "./serializer/Number";
import JSONSerializer from "./serializer/JSON";

export {
  Adapter,
  storage,
  BooleanSerializer,
  NumberSerializer,
  JSONSerializer,
  setDefaultStorageAdapter,
  IStorage,
  ISerializer
};
