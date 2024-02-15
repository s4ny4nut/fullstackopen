import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useContext } from "react"
import NotificationContext from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
    onError: (error) => {
      dispatch({type: 'SHOW_NOTIFICATION', payload: 'too shord anecdote, must have length 5 or more'})
      setTimeout(() => {
        dispatch({type: 'HIDE_NOTIFICATION'})
      }, 5000)
    }
  })
  const [, dispatch] = useContext(NotificationContext)
  

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    const getId = () => (100000 * Math.random()).toFixed(0)
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0, id: getId})
    dispatch({type: 'SHOW_NOTIFICATION', payload: `anecdote '${content}' added to the list`})
    setTimeout(() => {
      dispatch({type: 'HIDE_NOTIFICATION'})
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
