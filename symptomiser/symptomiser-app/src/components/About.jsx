import React from 'react'

export default function() {

    return <section className="about">
        <h1>About the Symptomiser</h1>
        <p>The symptomiser is an interactive visual tool to accurately describe symptoms, designed to facilitate symptom report by patients and doctors.</p>
        <p>Firstly, the app provides a query system that receives common words and returns suggestions of related medical terms. This query system was kindly provided by the B2SLab of the UPC.</p>
        <div className="about__links">
            <a className="about__links--item" href="http://b2slab.upc.edu/">B2S Research Group</a>
        </div>
        <p>The user can then navigate through a series of related terms from the HPO database in order to find the term that describes the symptom as accurately as possible. 
            Using the HPO database ensures that standardised medical language is included in the report and the addition of the HPO codes allows searching for additional details about the symptom in the database.</p>
        <div className="about__links">
            <a className="about__links--item" href="https://hpo.jax.org/app/">HPO</a>
        </div>
        <p>Once the most accurate term has been submitted, the user can add a series of details such as position or severity, and add comments to the symptom.</p>
        <p>The user is then able to generate a symptom list and then send it to themselves or a doctor by e-mail.</p>
        <p>This app was developed by Pau Atienza.</p>
        <div className="about__links">
            <a className="about__links--item" href="https://www.linkedin.com/in/pau-atienza-full-stack-developer/">Pau Atienza</a>
        </div>
  </section>
}




