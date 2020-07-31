import React from 'react'
import arrow from '../images/up-arrow.svg'
import { useEffect, useState } from 'react'
import Feedback from './Feedback'
import { retrieveTermsById, updateSymptom, addModifierToSymptom, deleteModifierFromSymptom, retrieveSymptomToModifyFromStorage } from 'symptomiser-client-logic'

export default function( { goToSymptomList } ) {

    const [modifier, setModifier] = useState(null)
    const [showConfidence, setShowConfidence] = useState(null)
    const [symptomToModify, setSymptomToModify] = useState(retrieveSymptomToModifyFromStorage())
    const [feedback, setFeedback] = useState(null)


    useEffect(()=>{
        try{
            updateModifier("HP:0012823")
        }catch(error){
            const { message } = error
    
            setFeedback({level: "error", message})
        }
    }, [symptomToModify])

    const updateModifier = async (id) =>{
        try{
            setModifier(await retrieveTermsById(id))
        }catch(error){
            const { message } = error
    
            setFeedback({level: "error", message})
        }
    }

    const submitModifier = (confidenceLevel)=>{
        try{
            const modifiedSymptom = addModifierToSymptom(confidenceLevel, modifier)

            setSymptomToModify(modifiedSymptom)
            setShowConfidence(false)
            setFeedback({ level: "success", message: "The modifier was added. Don't forget to save the changes before you continue."})
        }catch(error){
            const { message } = error
        
            setFeedback({level: "error", message})
        }
    }

    const deleteModifier = name=>{
        try{
            const modifiedSymptom = deleteModifierFromSymptom(name)
    
            setSymptomToModify(modifiedSymptom)
            setFeedback({ level: "success", message: "The modifier was deleted. Don't forget to save the changes in the details section before you continue."})

        }catch(error){
            const { message } = error
        
            setFeedback({level: "error", message})
        }
    }

    const saveModifiedSymptom = async event =>{
        try{
            event.preventDefault()
    
            const comments = event.target.form.comment.value
            await updateSymptom(comments)
            goToSymptomList()
        }catch(error){
            const { message } = error

            setFeedback({level: "error", message})
        }
    }

    return <>
        <section className="form">
            {feedback && <Feedback message = {feedback.message} level = {feedback.level}/>}
            {symptomToModify?<form className="form__main">
                <h2 className="form__element--name">Symptom Information:</h2>
                <div className = "form__symptom">
                    <p>Term:</p>
                    <p>{symptomToModify.term.name}</p>
                </div >
                <ul className = "form__modifiers">
                    <p>Clinical modifiers:</p>
                    {symptomToModify.modifiers && symptomToModify.modifiers.length?<>
                        {symptomToModify.modifiers.map(modifier=><li key = {modifier.HPO_id}>
                            <p>{modifier.name}</p>
                            <button className="symptom__term" onClick = {()=>deleteModifier(modifier.name)}>Delete</button>
                        </li>)}
                    </>: "You haven't added any modifiers yet"}
                </ul>
                <div className="form__element"> 
                    <p>Comments:</p>
                    <textarea maxLength = "200" wrap = "soft" className="form__element--input" spellCheck = 'false' type = "text" name="comment" placeholder = "Write any additional comments here" defaultValue = {symptomToModify.comments?symptomToModify.comments:''}/>
                </div>
                <div className = "form__button">
                    <button type = 'submit' onClick = {event =>saveModifiedSymptom(event)}>Save changes</button>
                </div>
            </form>: <p>You haven't selected a symptom to add details to.</p>}
        </section>
        <section className="symptom">
            {modifier && <>{modifier.higher.length && modifier.higher[0].name !== 'All'?<header className="symptom__top">
                <ul className="symptom__bottom--terms">
                    {modifier.higher.map(modifier =>
                    <li key = {modifier.HPO_id}>
                        <button onClick = {()=>{updateModifier(modifier.HPO_id)}} className="symptom__term">{modifier.name}</button>
                    </li>)}
                </ul>
                <img className="symptom__top--arrow" alt = "" src={arrow} />
                <p>Less specific terms</p>
            </header>:<></>}
            {modifier.term.HPO_id !== "HP:0012823"  && <main className="symptom__main">
                <div className="symptom__main--identifiers">
                        <div className="symptom__main--name">{modifier.term.name}</div>
                </div>
                <div className="symptom__main--description">{modifier.term.def}</div>
                <div className="symptom__main--links">
                    {!showConfidence && !modifier.lower.length && <button  className="symptom__term" onClick = {()=>{setShowConfidence(true)}}>Add modifier</button>}
                    {showConfidence && <div>
                        <p>Degree of confidence:</p>
                        <div>
                        <button  className="symptom__term" onClick = {()=>{submitModifier('low')}}>Low</button>
                        <button  className="symptom__term" onClick = {()=>{submitModifier('medium')}}>Medium</button>
                        <button  className="symptom__term" onClick = {()=>{submitModifier('high')}}>High</button>
                        </div>
                    </div>}
                </div>
            </main>}
            {modifier.term.HPO_id === "HP:0012823"  && <main className="symptom__initialmain">
                <div className="symptom__main--identifiers">
                <div className="symptom__main--name">Adding clinical modifiers</div>
                </div>
                <div className="symptom__main--description">
                    Use the buttons below to find the terms that adjust to any of the specifics of your symptom (such as position or severity)
                </div>
            </main>}
            {modifier.lower.length? 
            <footer className="symptom__bottom">
                {modifier.term.HPO_id !== "HP:0012823"  && <>
                    <p>More specific terms: you need to navigate to the most specific terms to submit</p>
                    <img alt = "" className="symptom__bottom--arrow" src={arrow} />
                </>}
                <ul className="symptom__bottom--terms">
                {modifier.lower.map(modifier =>
                    <li key = {modifier.HPO_id}>
                        <button onClick = {()=>{updateModifier(modifier.HPO_id)}} className="symptom__term">{modifier.name}</button>
                    </li>)}
                </ul></footer>: <></>}
            </>}
        </section>
    </>
}