export function castArray(pAThing: unknown): Array<unknown> {
  return Array.isArray(pAThing) ? pAThing : [pAThing];
}
