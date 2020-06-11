export interface IAppleTreeParams {
  soil: boolean;
  sunlight: boolean;
  water: boolean;
  ageYears: number;
}

export const appleTree = ({ ageYears, soil, sunlight, water }: IAppleTreeParams) => (soil && sunlight && water && ageYears > 5) ? 50 : 0;
