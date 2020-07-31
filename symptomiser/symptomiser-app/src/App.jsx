import React, { useState } from 'react'
import './style.sass'
import Landing from './components/Landing'
import SymptomList from './components/SymptomList'
import NavBar from './components/NavBar'
import About from './components/About'
import Results from './components/Results'
import Symptom from './components/Symptom'
import ModifiersForm from './components/ModifiersForm'
import Private from './components/Private'
import { setSymptomToModify } from 'symptomiser-client-logic'

import { Route, withRouter } from 'react-router-dom'

function App({ history }) {

  const[symptom, setSymptom] = useState(null)
  
  const goToSymptom = symptom=>{
    setSymptom(symptom)

    history.push('/symptom')
  }

  const goToResults = ()=>{
    history.push('/results')
  }

  const goToDetails = symptomName=>{
    setSymptomToModify(symptomName)

    history.push('/details')
  }

  const goToSymptomList = ()=>{
    history.push('/symptomlist')
  }

  return<div className="App">
    <Route exact path="/" render={() => <Landing goToResults = {goToResults}/>} />
    {history.location.pathname !== '/' && <NavBar history = {history}>
      <Route exact path="/symptomlist" render={() => <SymptomList goToDetails = {goToDetails}/>} />
      <Route exact path="/results" render={() => <Results goToSymptom = {goToSymptom}/>} />
      <Route exact path="/about" render={() => <About/>} />
      <Route exact path="/symptom" render={() => <Symptom symptom = {symptom} goToSymptomList = {goToSymptomList}/>} />
      <Route exact path="/details" render={() => <ModifiersForm goToSymptomList = {goToSymptomList}/>} />
      <Route exact path="/private" render={() => <Private/> }/>
    </NavBar>}
  </div>
  
}
export default withRouter(App)
