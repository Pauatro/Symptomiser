const { retrieveAllSymptoms } = require('symptomiser-server-logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        retrieveAllSymptoms()
            .then(symptoms => res.status(200).send({ symptoms }))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
