export interface IAppleTreeViewProps {
  apples: number;
}

export const appleTreeView = ({ apples }: IAppleTreeViewProps) => `${apples} apples`;
