const { retrieveAllSymptomLists } = require('symptomiser-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        retrieveAllSymptomLists()
            .then(symptomLists => res.status(200).send({ symptomLists }))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
