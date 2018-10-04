/**
 * The current (semver compliant) version number string of
 * state machine cat
 *
 * @type {string}
 */
export const version: string;

export interface IAllowedValue {
    default: string;
    values: Array<{
        name: string;
    }>;
}
export interface IAllowedValues {
    inputType: IAllowedValue;
    outputType: IAllowedValue;
    engine: IAllowedValue;
    direction: IAllowedValue;
}

/**
 * An object with for each of the options you can pass to
 * the render function
 * - the default value
 * - the possible values in an array of objects, each of which
 *   has the properties:
 *   - name: the value
 *
 */
export function getAllowedValues(): IAllowedValues;

export type InputType =
    "smcat" |
    "json"
;

export type OutputType =
    "smcat" |
    "dot"   |
    "json"  |
    "ast"   |
    "svg"   |
    "html"  |
    "scjson"|
    "scxml"
;

export type EngineType =
    "dot"   |
    "circo" |
    "fdp"   |
    "neato" |
    "osage" |
    "twopi"
;

export type DirectionType =
    "top-down"   |
    "bottom-top" |
    "left-right" |
    "right-left"
;

export interface IRenderOptions {
    inputType?: InputType;
    outputType?: OutputType;
    engine?: EngineType;
    direction?: DirectionType;
}

/**
 * Translates the input script to an outputscript.
 *
 * @param  {string} pScript     The script to translate
 * @param  {object} pOptions    options influencing parsing & rendering.
 *                              See below for the complete list.
 * @return {string}             the string with the rendered content if
 *                              no error was found
 * @throws {Error}              if an error occurred and no callback
 *                              function was passed: the error
 *
 * Options: see https://github.com/sverweij/state-machine-cat/docs/api.md
 *
 */
export function render(pScript: string, pOptions: IRenderOptions): string;
