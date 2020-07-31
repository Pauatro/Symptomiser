/**
 * retrieves the symptoms database from the server, transforms it into a .json file and downloads it.
 */

const { utils: { call } } = require('symptomiser-commons')
const context = require('./context')

module.exports = async function(){
    const { token } = this.storage

    debugger

    const {status, body} = await call('GET', `${this.API_URL}/symptoms/retrieve`, undefined, { 'Authorization': `Bearer ${token}` })
    
    if (status !== 200) {
        throw new Error("There was a network error")
    }

    return body
    
}.bind(context)