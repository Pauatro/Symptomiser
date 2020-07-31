import React, {useState} from 'react'
import arrow from '../images/up-arrow.svg'
import Feedback from './Feedback'
import { retrieveTermsById, saveNavigationClick, registerSymptom, saveSymptom } from 'symptomiser-client-logic'

export default function( { symptom, goToSymptomList } ) {

  const [highlightedSymptom, setHighlightedSymptom] = useState(symptom)
  const [showConfidence, setShowConfidence] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const retrieveSymptom = async id =>{
    try{
      const newSymptom = await retrieveTermsById(id)

      const {term: {HPO_id}} = newSymptom
      saveNavigationClick(HPO_id)
      setHighlightedSymptom(newSymptom)
    }catch(error){
      const { message } = error

      setFeedback({level: "error", message})
    }
  }

  const submitSymptom = async confidenceLevel=>{
    try{
      const {term: {HPO_id, name}} = highlightedSymptom
  
      const {id: symptomId} = await registerSymptom(HPO_id, name, confidenceLevel)
      saveSymptom(HPO_id, name, confidenceLevel, symptomId)

      goToSymptomList()
    }catch(error){
      const { message } = error

      setFeedback({level: "error", message})
    }
  }

  return <section className="symptom">
    {feedback && <Feedback message={feedback.error} level={feedback.level} />}
    {highlightedSymptom && <>{highlightedSymptom.higher && highlightedSymptom.higher.length && highlightedSymptom.higher[0].name !== 'All'?<header className="symptom__top">
        <ul className="symptom__bottom--terms">
            {highlightedSymptom.higher.map(symptom =>
            <li key = {symptom.HPO_id}>
                <button onClick = {()=>{retrieveSymptom(symptom.HPO_id)}} className="symptom__term">{symptom.name}</button>
            </li>)}
        </ul>
        <img className="symptom__top--arrow" alt = "" src={arrow} />
        <p>Less specific terms</p>
    </header>:<></>}
    <main className="symptom__main">
      <div className="symptom__main--identifiers">
            <div className="symptom__main--name">{highlightedSymptom.term.name}</div>
      </div>
      <div className="symptom__main--description">{highlightedSymptom.term.def}</div>
      <div className="symptom__main--links">
        {showConfidence === false && <button  className="symptom__term" onClick = {()=>{setShowConfidence(true)}}>Add to symptom list</button>}
        {showConfidence === true && <div>
            <p>Degree of confidence:</p>
            <div>
              <button  className="symptom__term" onClick = {()=>{submitSymptom('low')}}>Low</button>
              <button  className="symptom__term" onClick = {()=>{submitSymptom('medium')}}>Medium</button>
              <button  className="symptom__term" onClick = {()=>{submitSymptom('high')}}>High</button>
            </div>
          </div>}
      </div>
    </main>
      {highlightedSymptom.lower && highlightedSymptom.lower.length? 
       <footer className="symptom__bottom">
        <p>More specific terms: check if any of these fit with your symptom</p>
        <img className="symptom__bottom--arrow" alt = "" src={arrow} />
        <ul className="symptom__bottom--terms">
          {highlightedSymptom.lower.map(symptom =>
            <li key = {symptom.HPO_id}>
                <button onClick = {()=>{retrieveSymptom(symptom.HPO_id)}} className="symptom__term">{symptom.name}</button>
            </li>)}
        </ul></footer>: <></>}
    </>}
  </section>
}