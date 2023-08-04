export function cloneDeep<AnyType>(pObject: AnyType): AnyType {
  // when we drop node 16 we can use [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
  // in stead of this hack
  return JSON.parse(JSON.stringify(pObject));
}
