import { useState, useEffect } from 'react'
import axios from 'axios'
import './AboutUs.css'

/**
 * A React component that represents the AboutUs page of the app.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */

const AboutUs = props => {
    const [aboutText, setAboutText] = useState([])
    const [aboutImage, setAboutImage] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState('')
    const [feedback, setFeedback] = useState('')

    const fetchAbout = () => {
      axios
        .get(`${import.meta.env.VITE_SERVER_HOSTNAME}/about`)
        .then(response => {
          // axios bundles up all response data in response.data property
          const texts = response.data.text
          const img = response.data.image
          setAboutText(texts)
          setAboutImage(img)
        })
        .catch(err => {
          const errMsg = JSON.stringify(err, null, 2) // convert error object to a string so we can simply dump it to the screen
          setError(errMsg)
        })
        .finally(() => {
          // the response has been received, so remove the loading icon
          setLoaded(true)
        })
    }
    useEffect(() => {
      fetchAbout()
  
      const intervalHandle = setInterval(() => {
        fetchAbout()
      }, 5000)
  
      return e => {
        clearInterval(intervalHandle)
      }
    }, [])
    

  return (
    <>
    {aboutText.map((text, i) => (
                    <p>
                        {text}
                    </p>
                ))}
    <img src={aboutImage} width="300" height="400"/>
    </>
  )
}

// make this component available to be imported into any other file
export default AboutUs
