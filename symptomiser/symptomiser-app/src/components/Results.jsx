import React, {useState, useEffect} from 'react'

import Feedback from './Feedback'

import { retrieveTermsById, saveNavigationClick, retrieveResultsFromStorage } from 'symptomiser-client-logic'

export default function( { goToSymptom } ) {

  const [results, setResults] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [highlightedSymptom, setHighlightedSymptom] = useState(null)

  useEffect(()=>{
    try{
      setResults(retrieveResultsFromStorage())

    }catch(error){
      const { message } = error

      setFeedback({level: "error", message})
    }
  }, [])

  const retrieveSymptom = async id =>{
    try{
      const symptom = await retrieveTermsById(id)

      const {term: {HPO_id}} = symptom
      saveNavigationClick(HPO_id)
      setHighlightedSymptom(symptom)
    }catch(error){
      const { message } = error

      setFeedback({level: "error", message})
    }
  }

  return <section className="results">
    {feedback && <Feedback message = {feedback.message} level = {feedback.level?feedback.level:null}/>}
    <p className = 'results__list--title'>Proposed terms</p>
    <ul className="results__list">
      {results?results.prediction.map(symptom => <li key={symptom.predictionCode}>
        <button className='results__list--item' onClick = {()=>{retrieveSymptom(symptom.predictionCode)}}>{symptom.predictionName}</button>
      </li>): <li className="results__list--title">The search yielded no results, there was likely a problem.</li>}
    </ul>
    {highlightedSymptom && 
    <main className='results__main'>
        <div className = 'results__main--name'>{highlightedSymptom.term.name}</div>
        <div className='results__main--definition'>{highlightedSymptom.term.def}</div>
        <button className='results__list--item' onClick = {()=>{goToSymptom(highlightedSymptom)}}>Navigate from this term</button>
    </main>}
  </section>
}