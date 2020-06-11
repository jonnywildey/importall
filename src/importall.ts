import { promisify } from 'util';
import { TypescriptParser, DefaultDeclaration, File } from 'typescript-parser';

import glob from "glob";
import { dirname, join } from "path";
const promiseGlob = promisify(glob);

export type ImportKeyword = "import" | "export";

const TS_EXTENSION_GLOB = "*.{ts,tsx}";

export interface IGetParsedFilesParams {
  filePath: string;
  ignoreGlobs: string[];
}

export const getParsedFiles = async ({ ignoreGlobs, filePath }: IGetParsedFilesParams) => {
  // Get applicable files
  const dirPath = dirname(filePath);
  const ignorePaths = [filePath, ...ignoreGlobs.map(ignoreGlob => join(dirPath, ignoreGlob))];
  const filesInPath = await promiseGlob(`${dirPath}/${TS_EXTENSION_GLOB}`, {
    ignore: ignorePaths
  });
  // Parse files
  const parser = new TypescriptParser();
  return await Promise.all(filesInPath.map((fp) => parser.parseFile(fp, "./")));
}


export interface IImportAllParams {
  importKeyword: ImportKeyword;
  parsedFiles: File[];
}

export const importall = ({ parsedFiles, importKeyword }: IImportAllParams) => {
  return parsedFiles.map(parsedFile => generateImportStatementsFromFile(parsedFile, importKeyword))
  .filter( f => Boolean(f))
  .join("\n");
}

export interface IGenerateImportStatementsFromFileParams {
  parsedFiles: File[];
  importKeyword: ImportKeyword;
}

const generateImportStatementsFromFile = (parsedFile: File, importKeyword: ImportKeyword): string | undefined => {
  // Make sure there are some declarations
  if (!parsedFile.declarations || parsedFile.declarations.length === 0) {
    return undefined;
  }
  const exportedDeclarations = parsedFile.declarations.filter((f) => (f as any).isExported);
  if (exportedDeclarations.length === 0) {
    return undefined;
  }
  // Generate import statement
  return `${importKeyword} { ${exportedDeclarations.map((d: any) => {
    if (d instanceof DefaultDeclaration) {
      return `default as ${d.name}`;
    }
    return d.name;
  }).join(", ")} } from "./${parsedFile.parsedPath.name}";`;
}
