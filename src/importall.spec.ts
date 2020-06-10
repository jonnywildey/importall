import { importall } from "./importall";
import { ignoreTest, ignoreGlobs } from "./ignoreGlobs";
import { join } from "path";

const ORCHARD_DIR = join(__dirname, "test-directory", "orchard");


describe("importall", () => {

  it("imports all modules and types", async () => {

    const importStatement = await importall({
      filePath: join(ORCHARD_DIR, "index.ts"),
      ignoreGlobs: [ignoreTest],
      importKeyWord: "import"
    });

    expect(importStatement).toEqual(`import { IAppleTreeParams, appleTree } from "./appleTree";
import { IAppleTreeViewProps, appleTreeView } from "./appleTreeView";
import { ICiderMakerParams, CiderTypes, ciderMaker } from "./ciderMaker";
import { IPeachTreeParams, peachTree } from "./peachTree";`);

  });

  it("exports all modules and types, including test types that aren't ignored", async () => {

    const exportStatement = await importall({
      filePath: join(ORCHARD_DIR, "index.ts"),
      ignoreGlobs: [],
      importKeyWord: "export"
    });

    expect(exportStatement).toEqual(`export { ITestParams } from "./appleTree.test";
export { IAppleTreeParams, appleTree } from "./appleTree";
export { IAppleTreeViewProps, appleTreeView } from "./appleTreeView";
export { ICiderMakerParams, CiderTypes, ciderMaker } from "./ciderMaker";
export { IPeachTreeParams, peachTree } from "./peachTree";`);

  });

  it("ignores index using the default globs", async () => {

    const importStatement = await importall({
      filePath: join(ORCHARD_DIR, "newFile.ts"),
      ignoreGlobs,
      importKeyWord: "import"
    });

    expect(importStatement).toEqual(`import { IAppleTreeParams, appleTree } from "./appleTree";
import { IAppleTreeViewProps, appleTreeView } from "./appleTreeView";
import { ICiderMakerParams, CiderTypes, ciderMaker } from "./ciderMaker";
import { IPeachTreeParams, peachTree } from "./peachTree";`);

  });

});
