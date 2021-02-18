import { plainToClass } from 'class-transformer';
import { getClass } from '@typegoose/typegoose';

export function transform(doc, obj) {
  // @ts-ignore
  return plainToClass(getClass(doc.constructor.modelName || doc.constructor.path), obj);
}
