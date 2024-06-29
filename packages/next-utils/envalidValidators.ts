import * as envalid from "envalid";
import fs from "node:fs";
import path from "node:path";

export const directoryPathValidator = envalid.makeExactValidator((value) => {
  if (value.length === 0) {
    throw new Error("not specified");
  }
  return path.resolve(value);
});

export const existingFilePathArrayValidator = envalid.makeExactValidator(
  (value) => {
    if (value.length === 0) {
      return [];
    }
    return value.split(path.delimiter).flatMap((relativePath) => {
      if (relativePath.length === 0) {
        return [];
      }
      const absolutePath = path.resolve(relativePath);
      const stat = fs.statSync(absolutePath);
      if (stat.isFile()) {
        return [absolutePath];
      } else if (stat.isDirectory()) {
        const filePaths: string[] = [];
        for (const dirent of fs.readdirSync(absolutePath, {
          withFileTypes: true,
        })) {
          if (!dirent.isFile()) {
            continue;
          }
          filePaths.push(path.resolve(absolutePath, dirent.name));
        }
        return filePaths;
      } else {
        throw new Error(relativePath);
      }
    });
  },
);

export const intValidator = envalid.makeExactValidator<number>(parseInt);

export const languageTagArrayValidator = envalid.makeExactValidator((value) => {
  if (value.length === 0) {
    return [];
  }
  return value.split(",").map((subValue) => subValue.trim());
});
