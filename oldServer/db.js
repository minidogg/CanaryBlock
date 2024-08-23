// Imports
import * as fs from 'fs';
import * as path from 'path';
import * as fu from './file.js';

// Generate database related paths
const dbPath = path.resolve("../db");
const blockedPath = path.join(dbPath, "/blocked.cbdb");
const whitelistPath = path.join(dbPath, "/whitelist.cbdb");

// Ensure database files and directories are generated.
fu.TryMkDir(dbPath);
fu.TryMkFile(blockedPath, "", "utf-8");
fu.TryMkFile(whitelistPath, "", "utf-8");

// Cache arrays to minimize reads
let blockedCache = new Set();
let whitelistCache = new Set();

// Chunk Size
// TODO: Change the code so that we can support a bigger chunk size.
const CHUNK_SIZE = 1;


// General Finding Function
async function DBFind(filePath, condition) {
    const stream = fs.createReadStream(filePath, {
        highWaterMark: CHUNK_SIZE
    });
    let text = ""
    let found = false

    for await (const data of stream) {
        text += data.toString()
        if (text.endsWith("\n")) {
            text = text.substring(0, text.length-1)
            if(text[text.length-1]=="\r")text = text.substring(0, text.length-1)



            if (condition(text) == true) {
                found = true
                break
            }

            text = ""

        }
    }

    return found
}

function ManageCacheOverflow(set, max = 50){
    if (set.size >= max) {
        // Convert to array to remove oldest entry
        const oldest = Array.from(set)[0];
        set.delete(oldest);
    }
}

// TODO: Name this variable better
async function SillyFinder9000(filePath, cache, url){
    for(let i of cache){
        if(typeof(i)=="string"&&url.startsWith(i)==true){
            return true;
        }
        if(i instanceof RegExp&&i.test(url)){
            return true;
        }
    }


    let foundCondition = function(text){
        try{
            if(url.startsWith(text)){
                cache.add(text)
                ManageCacheOverflow(cache)
                return true;
            }
            let reg = new RegExp(text);

            if(reg.test(url)){
                cache.add(reg)
                ManageCacheOverflow(cache)
                return true;
            }
        }catch(err){
            console.warn(err)
        }
        return false;
    }

    return DBFind(filePath, foundCondition)
}

// Function for checking if a url is blocked
async function IsBlocked(url){
    // if(IsWhitelisted(url)==true)return false;
    return SillyFinder9000(blockedPath, blockedCache, url)
}


// Function for checking if a url is whitelisted
async function IsWhitelisted(url){
    return SillyFinder9000(whitelistPath, whitelistCache, url)
}

console.time("No Cache")
console.log(await IsBlocked("https://google.com/addsasads")) // False
console.log(await IsWhitelisted("https://google.com/dsasads")) // True
console.log(await IsBlocked("https://sites.google.com/site/classroom6x/the-final-earth-2?authuser=0")) // True
console.log(await IsWhitelisted("https://sites.google.com/site/classroom6x/the-final-earth-2?authuser=0")) // False
console.timeEnd("No Cache")

console.time("Cache")
console.log(await IsBlocked("https://google.com/addsasads")) // False
console.log(await IsWhitelisted("https://google.com/dsasads")) // True
console.log(await IsBlocked("https://sites.google.com/site/classroom6x/the-final-earth-2?authuser=0")) // True
console.log(await IsWhitelisted("https://sites.google.com/site/classroom6x/the-final-earth-2?authuser=0")) // False
console.timeEnd("Cache")

