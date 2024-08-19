// e=>e.isRegex==false?url.startsWith(e.url):new RegExp(e.url).test(url)

// Imports
import * as fs from 'fs';
import * as path from 'path';
import * as fu from './file.js';

// Generate database related paths
const dbPath = path.resolve("../db");
const blockedPath = path.join(dbPath, "/blocked.cbdb")
const whitelistPath = path.join(dbPath, "/whitelist.cbdb")

// Ensure database files and directories are generated.
fu.TryMkDir(dbPath)
fu.TryMkFile(blockedPath, "", "utf-8")
fu.TryMkFile(whitelistPath, "", "utf-8")


// Function for checking if a url is blocked