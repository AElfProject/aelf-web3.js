/**
 * @file transform protobuf
 * @author atom-yang
 */
import { base58, decodeAddressRep } from './utils';
import { inputAddressFormatter } from './formatters';

const isWrappedBytes = (resolvedType, name) => {
  if (!resolvedType.name || resolvedType.name !== name) {
    return false;
  }
  if (!resolvedType.fieldsArray || resolvedType.fieldsArray.length !== 1) {
    return false;
  }
  return resolvedType.fieldsArray[0].type === 'bytes';
};

const isAddress = resolvedType => isWrappedBytes(resolvedType, 'Address');

const isHash = resolvedType => isWrappedBytes(resolvedType, 'Hash');

export function transform(inputType, origin, transformers = []) {
  const fieldsLength = (inputType.fieldsArray || []).length;
  let result = origin;
  if (fieldsLength === 0) {
    return origin;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const { filter, transformer } of transformers) {
    if (filter(inputType) && origin) {
      return transformer(origin);
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  Object.keys(inputType.fields).forEach(field => {
    const {
      rule,
      name,
      resolvedType
    } = inputType.fields[field];
    if (resolvedType) {
      if (rule && rule === 'repeated') {
        let value = origin[name];
        if (value && Array.isArray(value)) {
          value = value
            .filter(v => v !== null && v !== undefined)
            .map(item => transform(resolvedType, item, transformers));
        }
        result = {
          ...result,
          [name]: value
        };
      } else {
        result = {
          ...result,
          [name]: origin[name] !== null && origin[name] !== undefined
            ? transform(resolvedType, origin[name] || {}, transformers) : origin[name]
        };
      }
    }
  });
  return result;
}

export function transformMapToArray(inputType, origin) {
  const fieldsLength = inputType.fieldsArray ? inputType.fieldsArray.length : 0;
  let result = origin;
  if (!origin) {
    return origin;
  }
  if (fieldsLength === 0 || (fieldsLength === 1 && !inputType.fieldsArray[0].resolvedType)) {
    return origin;
  }
  if (isAddress(inputType) || isHash(inputType)) {
    return origin;
  }
  const {
    fields,
    options = {}
  } = inputType;
  if (fieldsLength === 2 && fields.value && fields.key && options.map_entry === true) {
    return Object.keys(origin || {}).map(key => ({ key, value: origin[key] }));
  }
  // eslint-disable-next-line no-restricted-syntax
  Object.keys(inputType.fields).forEach(field => {
    const {
      name,
      resolvedType
    } = inputType.fields[field];
    if (resolvedType) {
      if (origin[name] && Array.isArray(origin[name])) {
        let value = origin[name];
        value = value.map(item => transformMapToArray(resolvedType, item));
        result = {
          ...result,
          [name]: value
        };
      } else {
        result = {
          ...result,
          [name]: transformMapToArray(resolvedType, origin[name])
        };
      }
    }
  });
  return result;
}

export function transformArrayToMap(inputType, origin) {
  const fieldsLength = (inputType.fieldsArray || []).length;
  let result = origin;
  if (fieldsLength === 0 || (fieldsLength === 1 && !inputType.fieldsArray[0].resolvedType)) {
    return origin;
  }
  if (isAddress(inputType) || isHash(inputType)) {
    return origin;
  }
  const {
    fields,
    options = {}
  } = inputType;
  if (fieldsLength === 2 && fields.value && fields.key && options.map_entry === true) {
    return origin.reduce((acc, v) => ({
      ...acc,
      [v.key]: v.value
    }), {});
  }
  // eslint-disable-next-line no-restricted-syntax
  Object.keys(fields).forEach(field => {
    const {
      name,
      resolvedType
    } = fields[field];
    if (resolvedType && origin !== null && origin !== undefined) {
      if (origin[name] && Array.isArray(origin[name])) {
        const {
          fieldsArray = [],
          fields: resolvedFields,
          options: resolvedOptions = {}
        } = resolvedType;
        // eslint-disable-next-line max-len
        if (fieldsArray.length === 2 && resolvedFields.value && resolvedFields.key && resolvedOptions.map_entry === true) {
          result = {
            ...result,
            [name]: origin[name].reduce((acc, v) => ({
              ...acc,
              [v.key]: v.value
            }), {})
          };
        } else {
          let value = origin[name];
          value = value.map(item => transformArrayToMap(resolvedType, item));
          result = {
            ...result,
            [name]: value
          };
        }
      } else {
        result = {
          ...result,
          [name]: transformArrayToMap(resolvedType, origin[name])
        };
      }
    }
  });
  return result;
}

export const INPUT_TRANSFORMERS = [
  {
    filter: isAddress,
    transformer: origin => {
      let result = origin;
      if (typeof origin === 'string') {
        result = {
          value: Buffer.from(decodeAddressRep(inputAddressFormatter(origin)), 'hex')
        };
      }
      if (Array.isArray(origin)) {
        result = origin.map(h => ({
          value: Buffer.from(decodeAddressRep(inputAddressFormatter(h)), 'hex')
        }));
      }
      return result;
    }
  },
  {
    filter: isHash,
    transformer: origin => {
      let result = origin;
      if (typeof origin === 'string') {
        result = {
          value: Buffer.from(origin.replace('0x', ''), 'hex')
        };
      }
      if (Array.isArray(origin)) {
        result = origin.map(h => ({
          value: Buffer.from(h.replace('0x', ''), 'hex')
        }));
      }
      return result;
    }
  },
];

export function encodeAddress(str) {
  const buf = Buffer.from(str, 'base64');
  return base58.encode(buf);
}

export const OUTPUT_TRANSFORMERS = [
  {
    filter: isAddress,
    transformer: origin => {
      let result = origin;
      if (Array.isArray(result)) {
        result = result.map(h => encodeAddress(h.value));
      }
      if (typeof result !== 'string') {
        result = encodeAddress(result.value);
      }
      return result;
    }
  },
  {
    filter: isHash,
    transformer: origin => {
      let result = origin;
      if (Array.isArray(result)) {
        result = result.map(h => Buffer.from(h.value, 'base64').toString('hex'));
      }
      if (typeof result !== 'string') {
        result = Buffer.from(result.value, 'base64').toString('hex');
      }
      return result;
    }
  },
];
