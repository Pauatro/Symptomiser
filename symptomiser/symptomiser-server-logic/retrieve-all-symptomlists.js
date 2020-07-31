/**
 * retrieves all symptoms from the mongoDB database and sanitizes them
 * 
 */

const { models: { SymptomList }, cleanSymptomList } = require('symptomiser-data')

module.exports = ()=>{
    return SymptomList.find({}).populate('symptomList').lean().then(symptomList=>cleanSymptomList(symptomList))
}