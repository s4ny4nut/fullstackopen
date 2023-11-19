import { useState } from 'react'

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

  const generateAnecdotesScoreObject = () => {
    let obj = {};
    for (let i = 0; i < anecdotes.length; i++) {
      obj[i] = 0;
    }
    return obj;
  }
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(generateAnecdotesScoreObject)

  const handleNextAnecdote = () => {
    const randomNum = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomNum);
  }

  const voteForAnecdote = () => {
    setPoints(prevState => {
      return {
        ...prevState,
        [selected]: points[selected] + 1
      }  
    })
  }

  const largestVoteScoreIndex = () => {
    const votesValues = Object.values(points)
    return votesValues.indexOf(Math.max(...votesValues));
  }

  return (
    <>
      <div>
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}
      </div>
      <div>
        has {points[selected]} votes
      </div>
      
      <button onClick={handleNextAnecdote}>Next anecdote</button>
      <button onClick={voteForAnecdote}>Vote</button>

      <div>
          <h1>Anecdote with most votes</h1>
          {anecdotes[largestVoteScoreIndex()]}
          <p>Has {points[largestVoteScoreIndex()]} votes</p>
        </div> 
    </>

  )
}

export default App
