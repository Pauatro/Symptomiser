import React, {useState, useEffect} from 'react'
import '../style.sass'
import Login from './Login'
import Admin from './Admin'
import { confirmLogin } from 'symptomiser-client-logic'

export default function (){
  const [login, setLogin] = useState(false)

  useEffect(()=>{
    (async function (){
        const confirmation = await confirmLogin()

        setLogin(confirmation)
    })()
  }, [])

  return <>
    { login ? <Admin/> : <Login setLogin = {setLogin}/>}
  </>
}
