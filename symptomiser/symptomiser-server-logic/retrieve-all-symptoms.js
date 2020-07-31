/**
 * retrieves all symptoms from the mongoDB database and sanitizes them
 * 
 */

const { models: { Symptom }, cleanSymptomList } = require('symptomiser-data')

module.exports = ()=>{
    return Symptom.find({}).lean().then(symptomList=>cleanSymptomList(symptomList))
}