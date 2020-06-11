import { importall, getParsedFiles } from "./importall";
import { ignoreTest, ignoreGlobs } from "./ignoreGlobs";
import { join } from "path";

const ORCHARD_DIR = join(__dirname, "test-directory", "orchard");


describe("importall", () => {

  it("imports all modules and types", async () => {


    const parsedFiles = await getParsedFiles({
      filePath: join(ORCHARD_DIR, "index.ts"),
      ignoreGlobs: [ignoreTest],
    });

    const importStatement = importall({ parsedFiles, importKeyword: "import" });

    expect(importStatement).toEqual(`import { IAppleTreeParams, appleTree } from "./appleTree";
import { IAppleTreeViewProps, appleTreeView } from "./appleTreeView";
import { ICiderMakerParams, CiderTypes, default as ciderMaker } from "./ciderMaker";
import { IPeachTreeParams, peachTree } from "./peachTree";`);

  });

  it("exports all modules and types, including test types that aren't ignored", async () => {

    const parsedFiles = await getParsedFiles({
      filePath: join(ORCHARD_DIR, "index.ts"),
      ignoreGlobs: [],
    });
    const exportStatement = importall({ parsedFiles, importKeyword: "export" });

    expect(exportStatement).toEqual(`export { ITestParams } from "./appleTree.test";
export { IAppleTreeParams, appleTree } from "./appleTree";
export { IAppleTreeViewProps, appleTreeView } from "./appleTreeView";
export { ICiderMakerParams, CiderTypes, default as ciderMaker } from "./ciderMaker";
export { IPeachTreeParams, peachTree } from "./peachTree";`);

  });

  it("ignores index using the default globs", async () => {

    const parsedFiles = await getParsedFiles({
      filePath: join(ORCHARD_DIR, "newFile.ts"),
      ignoreGlobs,
    });
    const importStatement = importall({ parsedFiles, importKeyword: "import" });

    expect(importStatement).toEqual(`import { IAppleTreeParams, appleTree } from "./appleTree";
import { IAppleTreeViewProps, appleTreeView } from "./appleTreeView";
import { ICiderMakerParams, CiderTypes, default as ciderMaker } from "./ciderMaker";
import { IPeachTreeParams, peachTree } from "./peachTree";`);

  });

  it("returns empty string if no files to import", async () => {
    const parsedFiles = await getParsedFiles({
      filePath: join(ORCHARD_DIR, "../", "index.ts"),
      ignoreGlobs: [ignoreTest],
    });

    const importStatement = importall({ parsedFiles, importKeyword: "import" });

    expect(importStatement).toEqual("");
  });

});
