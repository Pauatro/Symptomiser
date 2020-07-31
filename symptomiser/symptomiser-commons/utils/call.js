const Http = require('./http')
require('../polyfills/url')
require('../polyfills/function')

module.exports = function (method, url, body, headers, callback) {
    Http.validateMethod(method)
    URL.validate(url)

    if (arguments.length > 4)
        Function.validate(callback)

    return fetch(url, { method, headers, body })
        .then(res=> {
            return res.text()
            .then(body=>{
                return {
                    status: res.status,
                    body
                }
            })
        })
}
