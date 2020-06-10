export interface ICiderMakerParams {
  apples: number;
  peaches: number;
}

export type CiderTypes = "apple" | "peach";

export const ciderMaker = ({ apples, peaches }: ICiderMakerParams) => (apples + peaches) * 0.1;
