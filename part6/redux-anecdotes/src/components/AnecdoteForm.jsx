import { createAnecdote } from "../reducers/anecdoteReducer"
import { setNotificationMessage, removeNotificationMessage } from "../reducers/notificationReducer"
import { useDispatch } from "react-redux"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createNewAnecdote = async event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(setNotificationMessage(`you added ${content}`))
    setTimeout(() => {
      dispatch(removeNotificationMessage())
    }, 5000)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={createNewAnecdote}>
        <div>
          <input name='anecdote' />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm