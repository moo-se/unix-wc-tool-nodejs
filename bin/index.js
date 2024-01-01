#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const readline = require("readline");

function getBasename(p) {
  const baseName = path.basename(p);
  return baseName;
}

function getFileDetails(realPath, includeFileName = true) {
  try {
    const file = fs.statSync(realPath);
    const fileName = getBasename(realPath);
    if (includeFileName) {
      return `${file.size} ${fileName}`;
    } else {
      return file.size;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function getFileLines(realPath, includeFileName = true) {
  try {
    const content = fs.readFileSync(realPath, "utf-8");
    const lines = content.split(/\r?\n/);
    const fileName = getBasename(realPath);
    if (includeFileName) {
      return `${lines.length - 1} ${fileName}`;
    } else {
      return lines.length - 1;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function getWordCount(realPath, includeFileName = true) {
  try {
    const content = fs.readFileSync(realPath, "utf-8");
    const wordCount = content.split(/\s+/);
    const fileName = getBasename(realPath);
    if (includeFileName) {
      return `${wordCount.length - 1} ${fileName}`;
    } else {
      return wordCount.length;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function getFileCharacters(realPath, includeFileName = true) {
  try {
    const content = fs.readFileSync(realPath, "utf-8");
    const fileName = getBasename(realPath);
    if (includeFileName) {
      return `${content.length} ${fileName}`;
    } else {
      return content.length;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function handleNoOptions(realPath) {
  try {
    const lines = getFileLines(realPath, false);
    const wordCount = getWordCount(realPath, false);
    const fileSize = getFileDetails(realPath, false);
    const fileName = getBasename(realPath, "utf-8");
    return `${lines} ${wordCount} ${fileSize} ${fileName}`;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function handleStdin(data) {
  const lines = data.split(/\r?\n/);
  return lines.length - 1;
}

const usage = "\nUsage: get details of doc file";
const argv = yargs
  .usage(usage)
  .option("c", {
    alias: "count",
    describe: "outputs the number of bytes in a file.",
    type: "string",
    demandOption: false,
  })
  .option("l", {
    alias: "line",
    describe: "outputs the number of lines in a file.",
    type: "string",
    demandOption: false,
  })
  .option("w", {
    alias: "word",
    describe: "outputs the number of words in a file.",
    type: "string",
    demandOption: false,
  })
  .option("m", {
    alias: "character",
    describe: "outputs the number of characters in a file.",
    type: "string",
    demandOption: false,
  })
  .help(true).argv;
if (process.stdin.isTTY) {
  if (argv.c && argv.c != "") {
    console.log(getFileDetails(argv.c));
  } else if (argv.l && argv.l != "") {
    console.log(getFileLines(argv.l));
  } else if (argv.w && argv.w != "") {
    console.log(getWordCount(argv.w));
  } else if (argv.m && argv.m != "") {
    console.log(getFileCharacters(argv.m));
  } else if (argv._.length > 0) {
    console.log(handleNoOptions(argv._[0]));
  } else {
    console.log("Invalid command. Use --help for usage information.");
  }
} else {
  let data = "";

  process.stdin.setEncoding("utf-8");

  process.stdin.on("data", (chunk) => {
    data += chunk;
  });

  process.stdin.on("end", () => {
    console.log(handleStdin(data));
  });
}
