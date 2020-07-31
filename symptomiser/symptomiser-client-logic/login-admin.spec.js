require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, API_URL } } = process

const loginAdmin = require('./login-admin')
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

describe('client logic - login admin', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let username, email, password, adminId, hash

    beforeEach(() =>
        Admin.deleteMany()
            .then(() => {
                username = `username-${random()}`
                email = `e-${random()}@mail.com`
                password = `password-${random()}`

                return bcrypt.hash(password, 10)
            })
            .then(_hash => hash = _hash)
    )

    describe('when admin already exists', () => {
        beforeEach(() =>
            Admin.create({ username, email, password: hash })
                .then(admin => adminId = admin.id)
        )

        it('should succeed on correct credentials', async () =>{
            await loginAdmin(email, password)

            const { token } = context.storage

            expect(token).to.exist

            const { status } = await call('POST', `${API_URL}/admins/auth/confirm`, undefined, { 'Authorization': `Bearer ${token}` })

            expect(status).to.equal(200)
        })

        it('should fail on wrong password', async () => {
            password += 'wrong-'

            try{
                await loginAdmin(email, password)
            }catch(error){
                expect(error).to.be.an.instanceof(Error)
                expect(error.message).to.equal(`wrong password`)
            }
        })
    })

    it('should fail when admin does not exist', async () =>{
        try{
            await loginAdmin(email, password)
        }catch(error){
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`Admin with e-mail ${email} does not exist`)
        }
    })

    it('should fail when inputs with incorrect format are introduced', async () => {

        try {
            loginAdmin( "", password)

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(` is not an e-mail`)
        }

        try {
            loginAdmin( email, "")

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            loginAdmin( [""], password)

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(` is not an e-mail`)
        }

        try {
            loginAdmin( email, [""])

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(TypeError)
            expect(error.message).to.equal(` is not a string`)
        }
    })

    afterEach(() => Admin.deleteMany())

    after(mongoose.disconnect)
})