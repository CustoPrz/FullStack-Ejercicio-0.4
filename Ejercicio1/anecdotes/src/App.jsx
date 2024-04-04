import { useState } from 'react'

const Button = (props) => (
  <div>
  <button onClick={props.handleClick}>
    {props.text}
  </button>
  </div>
)
const Header = ({text}) => (
  <div>
    <h1>{text}</h1>
    </div>

)


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const [selected, setSelected] = useState(0)
  

  const RandomAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };
  const VoteAnecdote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  };

  const mostVotedAnecdoteIndex = votes.indexOf(Math.max(...votes));
  const mostVotedAnecdote = anecdotes[mostVotedAnecdoteIndex];


  return (
    <div>
      <Header text="Anecdote of the day"/>
      {anecdotes[selected]}
      <Button handleClick={RandomAnecdote} text="RandomAnecdote" />
      <Button handleClick={VoteAnecdote} text="Vote This anecdote"/>
      <p>Votes for this anecdote: {votes[selected]}</p>
      <Header text="Anecdote with most votes"/>
      <p>{mostVotedAnecdote}</p>
      <p>Numbers of votes: {votes[mostVotedAnecdoteIndex]}</p>
    </div>
  )
}

export default App