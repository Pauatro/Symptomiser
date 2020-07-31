require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, API_URL } } = process

const confirmLogin = require('./confirm-login')
const { random } = Math
const { expect } = require('chai')
require('symptomiser-commons/polyfills/json')
const { mongoose, models: { Admin } } = require('symptomiser-data')
const bcrypt = require('bcryptjs')
const { errors: { VoidError } } = require('symptomiser-commons')
const { utils: { call } } = require('symptomiser-commons')
const context = require('./context')
context.API_URL = API_URL
context.storage = {}

describe('client logic - confirm-login', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let username, email, password, hash

    beforeEach(async () =>{
        await Admin.deleteMany()

        username = `username-${random()}`
        email = `e-${random()}@mail.com`
        password = `password-${random()}`

        hash = await bcrypt.hash(password, 10)

        await Admin.create({ username, email, password: hash })
    })

    it('should succeed when admin is logged in', async () => {
        const { body } = await call('POST', `${API_URL}/admins/auth`,
        `{ "email": "${email}", "password": "${password}" }`,
        { 'Content-type': 'application/json' })
        
        const { token } = JSON.parse(body)

        context.storage.token = token

        const login = await confirmLogin()

        expect(login).to.equal(true)
    })

    it('should fail when admin is not logged in', async () =>{
        context.storage.token = null

        const login = await confirmLogin()

        expect(login).to.equal(false)
    })

    it('should fail when the token is not a valid JsonWebToken', async () =>{
        context.storage.token = 123

        const login = await confirmLogin()

        expect(login).to.equal(false)
    })

    afterEach(() => Admin.deleteMany())

    after(mongoose.disconnect)
})