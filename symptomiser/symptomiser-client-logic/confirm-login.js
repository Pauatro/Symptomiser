require('symptomiser-commons/polyfills/string')
require('symptomiser-commons/polyfills/function')
const { utils: { call } } = require('symptomiser-commons')
const context = require('./context')

module.exports =  async function () {
    const { token } = this.storage
    
    if (!token) return false

    const { status } = await call('POST', `${this.API_URL}/admins/auth/confirm`, undefined, { 'Authorization': `Bearer ${token}` })
    
    return status === 200
}.bind(context)