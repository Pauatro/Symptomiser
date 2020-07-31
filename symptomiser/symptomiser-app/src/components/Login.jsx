import React, {useState} from 'react'

import { loginAdmin } from 'symptomiser-client-logic'

import Feedback from './Feedback'

export default function ({setLogin}){

    const [feedback, setFeedback] = useState(null)

    const handleSubmit = async event => {
        event.preventDefault()

        let {email: {value: email}, password: {value: password}} = event.target

        try {
            await loginAdmin(email, password)

            setLogin(true)

        } catch ({ message }) {
            debugger
            setFeedback({error: message, level: "error"})
        }
    }
    
    return <div className='login'>
        <h1 className='login__title'>Login</h1>
        <div className="login__form">
            <form className='login__form' onSubmit={handleSubmit}>
                <input className='login__form--item' type="email" name="email" placeholder="e-mail" required />
                <input className='login__form--item' type="password" name="password" placeholder="password" required minLength="8" />
                <button className='login__form--button'>Submit</button>
            </form>
            {feedback && <Feedback message={feedback.error} level={feedback.level} />}
        </div>
    </div>
}