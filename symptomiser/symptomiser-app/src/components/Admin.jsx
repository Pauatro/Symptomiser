import React from 'react'

import { retrieveAllSymptoms, retrieveAllSymptomLists } from 'symptomiser-client-logic'

import Feedback from './Feedback'

export default function ({ feedback, setFeedback }){

    const retrieveSymptoms = async ()=>{
        try{
            const json = await retrieveAllSymptoms()

            generateFileAndDownload(json, "symptomsDatabase.json")
        } catch ({ message }) {
            setFeedback({error: message, level: "error"})
        }
    }

    const retrieveSymptomLists = async ()=>{
        try{
            const json = await retrieveAllSymptomLists()

            generateFileAndDownload(json, "symptomListsDatabase.json")
        } catch ({ message }) {
            setFeedback({error: message, level: "error"})
        }
    }

    const generateFileAndDownload = async (json, name) =>{
        const blob = new Blob([json],{type:'application/json'})

        const href = await URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = href
        link.download = name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
    
    return <div className='admin'>
        <h1 className='admin__title'>Admin</h1>
        <div className="admin__form">
            <button className='admin__form--button' onClick={retrieveSymptoms}>Download Database of Submitted Symptoms</button>
            <button className='admin__form--button' onClick={retrieveSymptomLists}>Download Database of Symptom Lists</button>           
            {feedback && <Feedback message={feedback.error} level={feedback.level} />}
        </div>
    </div>
}