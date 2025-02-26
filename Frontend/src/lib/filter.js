export function basicFilter(list, chars, property){
    return list.filter((listItem) => listItem[property].startsWith(chars))
}

let list = [{name:'election1'}, {name:'general-election'}, {name:'election3'}];

console.log(basicFilter(list, 'ele', 'name'));