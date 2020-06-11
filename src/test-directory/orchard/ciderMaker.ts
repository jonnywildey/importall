export interface ICiderMakerParams {
  apples: number;
  peaches: number;
}

export type CiderTypes = "apple" | "peach";

const ciderMaker = ({ apples, peaches }: ICiderMakerParams) => (apples + peaches) * 0.1;

export default ciderMaker;
