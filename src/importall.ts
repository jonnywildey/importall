import { promisify } from 'util';
import { TypescriptParser, DefaultDeclaration, File } from 'typescript-parser';

import glob from "glob";
import { dirname, join } from "path";
const promiseGlob = promisify(glob);

export type ImportKeyword = "import" | "export";

export interface IImportAllParams {
  importKeyWord: ImportKeyword;
  filePath: string;
  ignoreGlobs: string[];
}

const TS_EXTENSION_GLOB = "*.{ts,tsx}";

export const importall = async ({ filePath, ignoreGlobs, importKeyWord }: IImportAllParams) => {
  // Get applicable files
  const dirPath = dirname(filePath);
  const ignorePaths = [filePath, ...ignoreGlobs.map(ignoreGlob => join(dirPath, ignoreGlob))];
  const filesInPath = await promiseGlob(`${dirPath}/${TS_EXTENSION_GLOB}`, {
    ignore: ignorePaths
  });

  // Parse files
  const parser = new TypescriptParser();
  const parsedFiles = await Promise.all(filesInPath.map((fp) => parser.parseFile(fp, "./")));

  const importText = parsedFiles.map(parsedFile => generateImportStatementsFromFile(parsedFile, importKeyWord)).join("\n");

  return importText;
}

const generateImportStatementsFromFile = (parsedFile: File, importKeyWord: ImportKeyword): string => {
  // Make sure there are some declarations
  if (!parsedFile.declarations || parsedFile.declarations.length === 0) {
    return "";
  }
  const exportedDeclarations = parsedFile.declarations.filter((f) => (f as any).isExported);
  if (exportedDeclarations.length === 0) {
    return "";
  }
  // Generate import statement
  return `${importKeyWord} { ${exportedDeclarations.map((d: any) => {
    if (d instanceof DefaultDeclaration) {
      return `default as ${d.name}`;
    }
    return d.name;
  }).join(", ")} } from "./${parsedFile.parsedPath.name}";`;
}
