const {ObjectID} = require('mongodb')

module.exports= symptomList =>{

    let level = 0
    debugger

    (sanitiseElement = function(input, level){
        if(input instanceof Array ){
            level += 1
            input.forEach(element=>{
                sanitiseElement(element, level)
            })
        }
        else if (input instanceof Object && !(input instanceof Function) && !(input instanceof Date) && !(input instanceof ObjectID)){
            const keys = Object.keys(input)
            level += 1

            keys.forEach(key=>{
                if(key === "__v") delete input[key]
                else if (key === "_id"){

                    if (level === 2) input.id = input._id

                    delete input._id
                }
                else sanitiseElement(input[key], level)
            })
        }
        else return
    })(symptomList, level)

    return symptomList
}