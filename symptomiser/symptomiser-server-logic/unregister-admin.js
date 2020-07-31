require('symptomiser-commons/polyfills/string')
require('symptomiser-commons/polyfills/json')
const { utils: { Email }, errors: { UnexistenceError, CredentialsError } } = require('symptomiser-commons')
const { models: { Admin } } = require('symptomiser-data')
const bcrypt = require('bcryptjs')

module.exports = (id, email, password) => {
    String.validate.notVoid(id)
    String.validate.notVoid(email)
    Email.validate(email)
    String.validate.notVoid(password)

    return (async () => {
        const admin = await Admin.findById({ _id: id })

        if (!admin) throw new UnexistenceError(`admin with id ${id} does not exist`)

        if (admin.email !== email) throw new CredentialsError('wrong email')

        const match = await bcrypt.compare(password, admin.password)

        if (!match) throw new CredentialsError('wrong password')

        await Admin.deleteOne({_id: id})
    })()
}