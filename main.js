#!/usr/bin/env node
let fs = require('fs');
let path = require('path');

let input = process.argv.slice(2);
console.log(input);
let command = input[0];
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}
switch (command) {
    case "tree":
        treefn(input[1]);
        break;
    case "organize":
        organizefn(input[1]);
        break;
    case "help":
        helpfn();
        break;
    default:
        console.log("🙏 Please Input Right Command");
}

function organizefn(dirpath){
    //1.)For gven input path 
    let destPath;
    if(dirpath==undefined){
        //console.log("You have not entered a valid path!");
        destPath = process.cwd();
        return;
    }
    else{
            //2.)we have to create a folder organize
        let doesExist = fs.existsSync(dirpath);
        if(doesExist){
           destPath = path.join(dirpath,'organize-files');
           if(fs.existsSync(destPath)==false){
           fs.mkdirSync(destPath);
           }
        }
        else{
            console.log("The path provided is Invalid");
            return;
        }
    }
    organizeHelper(dirpath,destPath);
}

function organizeHelper(src, dest){
        //3.) Identify categories of all files present in that directory
   let childNames = fs.readdirSync(src);
   //console.log(childNames);
   for(let i=0;i<childNames.length;i++){
       let childAddress = path.join(src,childNames[i]);
       let isFile = fs.lstatSync(childAddress).isFile();
      if(isFile){
        //console.log(childNames[i]);
        let category = getCategory(childNames[i]);
        //console.log(childNames[i]," Belongs to ,",category);
        //4.) Copy those files to that organize directory
       sendFiles(childAddress,dest,category);

     }
}
}

function sendFiles(srcFilePath, dest,category) {
    let categoryPath = path.join(dest,category);
    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    console.log(fileName," Copied to ",category);
}

function getCategory(name) {
   let ext = path.extname(name);
   ext = ext.slice(1);
   
   for(let type in types) {
       let cTypeArray = types[type];
       for(let i=0;i<cTypeArray.length;i++){
           if(ext==cTypeArray[i]){
               return type;
           }
       }
   }
   return "other type";
   //console.log(ext);
}

function treefn(dirpath){
    //let destPath;
    if(dirpath==undefined){
        treeHelper(process.cwd(),"");
        return;
    }
    else{
            //2.)we have to create a folder organize
        let doesExist = fs.existsSync(dirpath);
        if(doesExist){
          treeHelper(dirpath,"");
        }
        else{
            console.log("The path provided is Invalid");
            return;
        }
    }
}

function treeHelper(dirpath, indent){
  //check if file or folder
  let isFile = fs.lstatSync(dirpath).isFile();
  if(isFile==true){
      let fileName = path.basename(dirpath);
      console.log(indent + "|----" + fileName);
    }
  else{
      let dirName = path.basename(dirpath);
      console.log(indent +"____" +dirName);
      let childrens = fs.readdirSync(dirpath);
      for(let i=0;i<childrens.length;i++){
       let childPath = path.join(dirpath,childrens[i]);
       treeHelper(childPath,indent + "\t");
      }
  }
}



function helpfn(dirpath){
    console.log(`List of all the commands :
                
                node main.js tree "directoryPath"
                node main.js organize "directoryPath"
                node main.js help `);
}


