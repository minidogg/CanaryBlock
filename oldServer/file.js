import * as fs from 'fs'

export function TryMkDir(path){
    if(!fs.existsSync(path))fs.mkdirSync(path)
}
export function TryMkFile(...args){
    if(!fs.existsSync(args[0]))fs.writeFileSync(...args)
}