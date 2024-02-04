import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog} className='addBlogForm'>
      <div>
        title
        <input id='title' type='text' value={title} name='Title' onChange={(event) => setTitle(event.target.value)}/>
      </div>
      <div>
        author
        <input id='author' type='text' value={author} name='Author' onChange={(event) => setAuthor(event.target.value)}/>
      </div>
      <div>
        url
        <input id='url' type='text' value={url} name='Url' onChange={(event) => setUrl(event.target.value)}/>
      </div>
      <button id='createBlog' onSubmit={addBlog}>create</button>
    </form>
  )
}

export default BlogForm