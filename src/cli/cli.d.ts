import type {
  IRenderOptions,
  IBaseRenderOptions,
} from "../../types/state-machine-cat.mjs";

export interface ICLIRenderOptions extends IRenderOptions {
  inputFrom: string;
  outputTo: string;
}

export interface ILooseCLIRenderOptions extends Partial<IBaseRenderOptions> {
  inputFrom?: string;
  outputTo?: string;
  /**
   * For the 'dot' renderer: Graph attributes to the engine
   */
  dotGraphAttrs?: string;
  /**
   * For the 'dot' renderer: Node attributes to the engine
   */
  dotNodeAttrs?: string;
  /**
   * For the 'dot' renderer: Edge attributes to the engine
   */
  dotEdgeAttrs?: string;
}
