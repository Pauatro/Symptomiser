/**
 * Checks user credentials.
 * 
 * @param {string} email The user e-mail. 
 * @param {string} password The user password.
 * 
 * @returns {Promise<String>} The authorization token if it resolves, an error if it rejects.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {Error} If e-mail does not match the expected format.
 */

require('symptomiser-commons/polyfills/string')
const { utils: { Email, call } } = require('symptomiser-commons')
const context = require('./context')

module.exports = function (email, password) {
    Email.validate(email)

    String.validate.notVoid(password)

    return call('POST', `${this.API_URL}/admins/auth`,
        `{ "email": "${email}", "password": "${password}" }`,
        { 'Content-type': 'application/json' })
        .then(({ status, body }) => {
            if (status === 200) {
                const { token } = JSON.parse(body)

                this.storage.token = token
            } else {
                const { error } = JSON.parse(body)
                
                throw new Error(error)
            }
        })
}.bind(context)