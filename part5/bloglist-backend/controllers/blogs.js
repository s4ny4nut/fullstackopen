const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {  
  const authorization = request.get('authorization')  
  if (authorization && authorization.startsWith('Bearer ')) {    
    return authorization.replace('Bearer ', '')  
  }  
  return null
}

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
  } catch(error) {
    next(error)
  }
})
 
blogsRouter.post('/', middleware.userExctractor, async (request, response, next) => {
  const body = request.body;

  if(!request.userToken) {
    return response.status(401).json({error: 'token missing'})
  }

  const decodedToken = jwt.verify(request.userToken, process.env.SECRET)
  if (!decodedToken.id) {    
    return response.status(401).json({ error: 'token invalid' })  
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })
  
  try {
    const savedBlog = await blog.save()
    savedBlog.populate('user', {username: 1, name: 1})
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middleware.userExctractor, async (request, response, next) => {
  const id = request.params.id
  const blog = await Blog.findById(id)

  if(!request.userToken) {
    return response.status(401).json({error: 'token missing'})
  }

  const decodedToken = jwt.verify(request.userToken, process.env.SECRET)
  if (!decodedToken.id) {    
    return response.status(401).json({ error: 'token invalid' })  
  }

  const user = await User.findById(decodedToken.id)
  

  try {
    if(blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(id)
      response.status(204).end()
    } else {
      response.status(403).json({ error: 'forbidden' })
    }
  } catch(error) {
    next(error)
  } 
})

blogsRouter.put('/:id', middleware.userExctractor, async (request, response, next) => {
  const body = request.body
  const id = request.params.id

  const lastBlog = await Blog.findById(id)

  if(!request.userToken) {
    return response.status(401).json({error: 'token missing'})
  }

  const decodedToken = jwt.verify(request.userToken, process.env.SECRET)
  if (!decodedToken.id) {    
    return response.status(401).json({ error: 'token invalid' })  
  }

  const user = await User.findById(decodedToken.id)

  const blog = {
    likes: body.likes,
    author: body.author,
    title: body.title,
    url: body.url
  }

  if(lastBlog.user.toString() === user.id.toString()) {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true})
    await updatedBlog.populate('user', {name: 1, username: 1})
    console.log(updatedBlog)
    response.status(201).json(updatedBlog)
  } else if (blog.likes >= lastBlog.likes) {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true})
    await updatedBlog.populate('user', {name: 1, username: 1})
    console.log(updatedBlog)
    response.status(201).json(updatedBlog)
  } else {
    next(error)
  }
})

module.exports = blogsRouter