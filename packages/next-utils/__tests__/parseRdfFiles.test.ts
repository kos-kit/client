import { describe, expect, it } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseRdfFiles } from "../parseRdfFiles";
import { Store } from "n3";

describe("parseRdfFiles", () => {
  const testDataDirPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "..",
    "test-data",
  );
  it("should parse unesco-thesaurus twice", async () => {
    const dataset = await parseRdfFiles(
      [
        path.resolve(testDataDirPath, "unesco-thesaurus.nt"),
        path.resolve(testDataDirPath, "unesco-thesaurus.nt.gz"),
      ],
      new Store(),
    );
    expect(dataset.size).toBe(88482);
  });
});
