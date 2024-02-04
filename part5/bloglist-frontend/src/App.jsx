import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Toggleable from './components/Togglable.jsx'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState({
    message: '',
    error: false
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Notification = ({ message, error }) => {
    if(!message) {
      return null
    }
    if(!error) {
      return (
        <div className='success' style={{ border: '1px solid green', color: 'green' }}>
          {message}
        </div>
      )
    } else {
      return (
        <div className='error' style={{ border: '1px solid red', color: 'red' }}>
          {message}
        </div>
      )
    }
  }

  const initNotification = (message, error, time = 5000) => {
    setMessage({
      message,
      error
    })
    setTimeout(() => {
      setMessage({
        message: '',
        error: false
      })
    }, time)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      initNotification(
        'Wrong credentials',
        true
      )
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    setUser(null)
    window.localStorage.clear()
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const blog = await blogService.createBlog(blogObject)
      setBlogs(blogs.concat(blog))
      initNotification(
        `a new blog ${blog.title} by ${blog.author} added`,
        false
      )
    } catch (exception) {
      initNotification(
        'Wrong data format',
        true
      )
    }
  }

  const addLike = async (likeObject, id) => {
    try {
      const likedBlog = await blogService.addLike(likeObject, id)
      const newLikedState = blogs.map(blog => {
        if(likedBlog.id === blog.id) {
          return likedBlog
        }
        return blog
      })
      setBlogs(newLikedState)
    } catch (exception) {
      initNotification(
        'Cannot add like to the post',
        true
      )
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(prevState => prevState.filter(item => item.id !== id))
      initNotification(
        'Blog post is successfully deleted',
        false
      )
    } catch (exception) {
      initNotification(
        'Cannot delete blog post',
        true
      )
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type='text'
          value={username}
          name='Username'
          onChange={(event) => setUsername(event.target.value)}/>
      </div>
      <div>
        password
        <input
          id='password'
          type='password'
          value={password}
          name='Password'
          onChange={(event) => setPassword(event.target.value)}/>
      </div>
      <button id='loginButton' type='submit'>login</button>
    </form>
  )

  const blogFormRef = useRef()
  const blogForm = () => (
    <Toggleable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog}/>
    </Toggleable>
  )

  const logoutButton = () => (
    <button id='logoutButton' type='button' onClick={handleLogout}>logout</button>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message.message} error={message.error}/>

      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in {logoutButton()}</p>
      </div>}
      {user && <div>
        <h2>create new</h2> {blogForm()}
      </div>}
      {blogs.sort((start, end) => end.likes - start.likes).map(blog =>
        <Blog
          key={blog.id}
          user={user}
          blog={blog}
          addLike={addLike}
          deleteBlog={deleteBlog}
        />
      )
      }
    </div>
  )
}

export default App