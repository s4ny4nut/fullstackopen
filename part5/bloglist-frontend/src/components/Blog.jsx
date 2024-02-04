import { useEffect, useState } from 'react'
import propTypes from 'prop-types'

const Blog = ({ user, blog, addLike, deleteBlog }) => {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setCurrentUser(user)
  }, [user])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [isVisible, setIsVisible] = useState(false)
  const showWhenVisible = isVisible ? '' : 'none'


  const handleView = () => {
    setIsVisible(!isVisible)
  }

  const handleAddLike = () => {
    const { likes, author, title, url, user, id } = blog
    const newObject = {
      likes: likes + 1,
      author,
      title,
      url,
      user: {
        name: user.name
      }
    }

    addLike(
      newObject,
      id
    )
  }

  const handleDelete = () => {
    let confirmDeletion = confirm(`Remove blog ${blog.title} by ${blog.author}`)

    if (confirmDeletion) {
      deleteBlog(blog.id)
    }
  }

  const DeleteButton = () => {
    if(!currentUser) {
      return null
    } else if (currentUser.username === blog.user.username) {
      return <button id='deleteBlog' onClick={handleDelete}>Delete</button>
    } else {
      return null
    }
  }

  return (
    <div style={blogStyle} className='blogWrapper'>
      <div>
        {blog.title} {blog.author}
        <button id='toggleVisibility' onClick={() => handleView()}>{isVisible ? 'hide' : 'view'}</button>
      </div>
      <div id='blogInner' style={{ display: showWhenVisible }}>
        <p className='url'>{blog.url}</p>
        <div className='likes'>likes: {blog.likes}
          <button id='likePost' onClick={handleAddLike}>like</button>
        </div>
        <p className='name'>{blog.user.name}</p>
        <DeleteButton/>
      </div>
    </div>
  )
}

Blog.propTypes = {
  user: propTypes.object.isRequired,
  blog: propTypes.object.isRequired,
  addLike: propTypes.func.isRequired,
  deleteBlog: propTypes.func.isRequired
}


export default Blog