import { useState } from 'react'

const Header = ({tittle}) => {
  return(
  <div>
    <h1>{tittle}</h1>
  </div>
  )
}
const StaticsLine = ({ text, value }) => {

  const displayValue = value !== 0 ? value : "No feedback given";

  return (
    <div>
      <p>
        {text} {displayValue}
      </p>
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const tittle = ['Give Feedback','Statics']
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const calculateAverage = () => {
    const total = good + neutral + bad;
    return total === 0 ? "No feedback given" : (good - bad) / total;
  };
  const calculatePercentage = () => {
    const total = good + neutral + bad;
    return total === 0 ? "No feedback given" : (good / total) * 100;
  };

  return (
    <div>
    <Header tittle={tittle[0]}/>
    <Button handleClick={() => setGood(good+1)} text="Good" />
    <Button handleClick={() => setNeutral(neutral+1)} text="Neutral" />
    <Button handleClick={() => setBad(bad+1)} text="Bad" />
    <Header tittle={tittle[1]}/>
    <StaticsLine text={"Good: "} value={good}/>
    <StaticsLine text={"Neutral: "} value={neutral}/>
    <StaticsLine text={"Bad: "} value={bad}/>
    <StaticsLine text={"Average: "} value={calculateAverage()}/>
    <StaticsLine text={"Porcentage: "} value={calculatePercentage()}/>
    </div>
  )
}

export default App