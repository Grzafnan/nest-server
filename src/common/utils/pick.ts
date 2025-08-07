/**
 * Picks specific keys from an object.
 *
 * @template T - The original object type.
 * @template K - Keys of T to pick.
 *
 * @param obj - The source object.
 * @param keys - An array of keys to extract.
 * @returns A new object containing only the specified keys.
 *
 * @example
 * const query = { page: '1', limit: '10', extra: 'ignore' };
 * const result = pick(query, ['page', 'limit']); // { page: '1', limit: '10' }
 */
//['page','limit','sortBy','sortOrder']

const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[],
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pick;
