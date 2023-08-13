export interface IStringIndex {
  [key: string]: any
}

/**
 * Find all values that are in obj1 but not in obj2
 *
 * @param obj1
 * @param obj2
 *
 * @return complementOfObj1
 */
export function objComplement(obj1: IStringIndex, obj2: IStringIndex): IStringIndex {
  const complementOfObj1: IStringIndex = {};


  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key)) {
      complementOfObj1[key] = obj1[key]
    } else if (Array.isArray(obj2[key])) {

    } else if (obj2[key] instanceof Object) {

      const complement = objComplement(obj1[key], obj2[key]);
      if (!isEmptyObject(complement)) {
        complementOfObj1[key] = complement
      }
    }
  }

  return complementOfObj1
}

const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0
}

export function patchObj(obj: IStringIndex, patch: IStringIndex): IStringIndex {
  const patchedObj = copy(obj);

  let value;
  for (let key in patch) {
    value = patch[key]

    patchedObj[key] = (value instanceof Object) ? patchObj(value, obj[key]) : value
  }

  return patchedObj;
}

export function copy(obj: IStringIndex): IStringIndex {

  let copyOfObj: any = Array.isArray(obj) ? [] : {};

  let value;
  for (const key in obj) {

    // Prevent self-references to parent object
    // if (Object.is(aObject[key], aObject)) continue;

    value = obj[key];

    copyOfObj[key] = (value instanceof Object) ? copy(value) : value;
  }

  return copyOfObj;
}

