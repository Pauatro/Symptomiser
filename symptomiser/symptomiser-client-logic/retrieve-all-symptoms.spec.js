require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL, API_URL } } = process

const retrieveAllSymptoms = require('./retrieve-all-symptoms')
const { random } = Math
const { expect } = require('chai')
require('symptomiser-commons/polyfills/json')
const { mongoose, models: { Symptom, Admin } } = require('symptomiser-data')
const bcrypt = require('bcryptjs')
const { utils: { call } } = require('symptomiser-commons')
const context = require('./context')

context.storage = {}

describe('client logic - retrieve all symptoms', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let content, limit, date, date2, date3, date4, HPO_id, name, confidenceLevel, predictionCode, predictionName,
    HPO_id2, userNavigationTime, serverResponseTime, clicks, prediction, symptom

    beforeEach(async () => {
        context.API_URL = API_URL
        
        await Symptom.deleteMany()
        await Admin.deleteMany()
        content = `content-${random()}`
        limit = 1
        date = new Date().toISOString()
        date2 = new Date().toISOString()
        date3 = new Date().toISOString()
        date4 = new Date().toISOString()

        HPO_id = `id-${random()}`
        name = `name-${random()}`
        confidenceLevel = `conf-${random()}`

        predictionCode = `predCode-${random()}`
        predictionName = `predName-${random()}`
        HPO_id2 = `id2-${random()}`


        clicks = [{HPO_id: HPO_id2, date: date4}]
        prediction = [{predictionCode, predictionName}]

        userNavigationTime = 0
        serverResponseTime = 0

        symptom = {navigation: {predictorInput: {content, limit, date}, predictorOutput: {prediction, date: date2}, clicks, userNavigationTime, serverResponseTime}, submittedTerm: {HPO_id, name, confidenceLevel, date: date3}}
        await Symptom.create(symptom)

        username = `username-${random()}`
        email = `e-${random()}@mail.com`
        password = `password-${random()}`

        const hash = await bcrypt.hash(password, 10)

        await Admin.create({ username, email, password: hash })
    })

    it('should succeed when admin is logged in', async () => {

        const { body } = await call('POST', `${API_URL}/admins/auth`,
        `{ "email": "${email}", "password": "${password}" }`,
        { 'Content-type': 'application/json' })

        const { token } = JSON.parse(body)

        context.storage.token = token

        const string = await retrieveAllSymptoms()

        expect(typeof string).to.equal("string")

        const { symptoms } = JSON.parse(string)

        const [retrievedSymptom] = symptoms

        const {navigation: {predictorInput: {content: _content, limit: _limit, date: _date}, predictorOutput: {prediction: _prediction, date: _date2}, clicks: _clicks, serverResponseTime, userNavigationTime}} = retrievedSymptom

        const {submittedTerm: {HPO_id: _HPO_id, name: _name, confidenceLevel: _confidenceLevel, date: _date3}} = retrievedSymptom
        
        expect(_date).to.equal(date)
        expect(_date2).to.equal(date2)
        expect(_date3).to.equal(date3)
        expect(_clicks[0].date).to.equal(clicks[0].date)

        expect(_content).to.equal(content)
        expect(_limit).to.equal(limit)
        expect(_prediction[0].predictionName).to.equal(predictionName)
        expect(_prediction[0].predictionCode).to.equal(predictionCode)
        expect(_clicks[0].HPO_id).to.equal(clicks[0].HPO_id)
        expect(_HPO_id).to.equal(HPO_id)
        expect(_name).to.equal(name)
        expect(_confidenceLevel).to.equal(confidenceLevel)

        expect(userNavigationTime).to.equal(0)
        expect(serverResponseTime).to.equal(0)
    })

    it('should fail when admin is not logged in', async () => {

        context.storage.token = null

        try{
            await retrieveAllSymptoms()
        }catch(error){
            expect(error).to.exist
        }
    })

    after(mongoose.disconnect)
})