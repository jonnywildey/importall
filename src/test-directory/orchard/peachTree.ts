export interface IPeachTreeParams {
  soil: boolean;
  sunlight: boolean;
  water: boolean;
  ageYears: number;
}

export const peachTree = ({ ageYears, soil, sunlight, water }: IPeachTreeParams) => (soil && sunlight && water && ageYears > 5) ? 40 : 0;
