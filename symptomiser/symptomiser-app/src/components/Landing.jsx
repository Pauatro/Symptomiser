import React from 'react'

import { useState } from 'react'

import { Link } from 'react-router-dom'

import Feedback from './Feedback'

import search from '../images/search-icon.png'

import { retrieveTermsByQuery, savePredictorInput, savePredictorOutput } from 'symptomiser-client-logic'

export default function({ goToResults }) {

    const [feedback, setFeedback] = useState(null)

    const symptomQuery = async event =>{
        event.preventDefault()

        const query = event.target.query.value
        try{
            savePredictorInput(query)
        
            const results = await retrieveTermsByQuery(query)

            savePredictorOutput(results)

            goToResults()
        }catch(error){
            const { message } = error

            setFeedback({level: "error", message})
        }
    }


    return <section className="landing">
        <h1 className="landing__title">Symptomiser</h1>
        <main className="landing__main">
            <form className="landing__main--form" onSubmit = {symptomQuery}>
                <input className="landing__main--input" name="query" required minLength = "2" spellCheck = 'false' placeholder="Describe your symptom in a few words" pattern="[a-zA-Z ]+" />
                <button className="landing__main--button" type = "submit">
                    <img alt = "" className="landing__main--image" src = {search}></img>
                </button>
            </form>
            <div className="landing__main--nav">
                <Link className="landing__main--link" to="/symptomlist">Your Symptom List</Link>
                <Link className="landing__main--link" to="/about">About the Symptomiser</Link>
            </div>
        </main>
        {feedback && <Feedback message = {feedback.message} level = {feedback.level?feedback.level:null}/>}
    </section>
}