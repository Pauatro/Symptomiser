const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        res.status(200).send()         
    } catch (error) {
        handleError(error, res)
    }
}
