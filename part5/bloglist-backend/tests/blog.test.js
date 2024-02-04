const listHelper = require('../utils/list_helper')
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))

  const userObjects = helper.initialUsers
    .map(user => new User(user))
  
  const promiseBlogArray = blogObjects.map(blog => blog.save())
  const promiseUserArray = userObjects.map(user => user.save())

  await Promise.all([
    Promise.all(promiseBlogArray),
    Promise.all(promiseUserArray)
  ])
})



test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

})

describe('most liked', () => {
  const mostRatedBlogPost = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12
  }

  test('when list has one high rated blog post, its data looks like that', () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    expect(result).toEqual(mostRatedBlogPost)
  })
})

test("blogs are returned in the correct amount as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test("verify id property has to be named id", async () => {
    const response = await api.get("/api/blogs")
    const body = response.body;
    for(let key in body) {
      expect(body[key].id).toBeDefined()
      expect(body[key]._id).toBeUndefined()
    }
})

test("succesfull blog post creation", async () => {
  const newBlog = {
    title: 'Jach Roll',
    author: 'Rilley Mack',
    url: 'https://gooomack.com',
    likes: 5
  }

  const user = await User.findOne({})

  const userWithToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userWithToken, process.env.SECRET)

  await api
    .post("/api/blogs")
    .set({ 'Authorization': `Bearer ${token}` }) 
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  
  const finalBlogs = await helper.blogsInDb();
  expect(finalBlogs).toHaveLength(helper.initialBlogs.length + 1);

  const titles = finalBlogs.map(blog => blog.title);
  expect(titles).toContain('Jach Roll')
})

test("the likes is missing from the request, it will default to the value 0", async () => {
  const newBlog = {
    title: 'Jach Roll',
    author: 'Rilley Mack',
    url: 'https://gooomack.com'
  }

  const user = await User.findOne({})

  const userWithToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userWithToken, process.env.SECRET)

  await api
    .post("/api/blogs")
    .set({ 'Authorization': `Bearer ${token}` }) 
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const blogsAtEndLikes = blogsAtEnd[blogsAtEnd.length - 1].likes
    expect(blogsAtEndLikes).toBe(0)
})

test("status 400 if the title or url properties are missing from the request data", async () => {
  const newBlogNoUrl = {
    title: 'Test Title',
    author: 'Test Author',
    likes: 5
  }

  const user = await User.findOne({})

  const userWithToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userWithToken, process.env.SECRET)

  await api
    .post('/api/blogs')
    .set({ 'Authorization': `Bearer ${token}` }) 
    .send(newBlogNoUrl)
    .expect(400);
  const blogsAtEnd = await api.get("/api/blogs");
  expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length);

  const newBlogNoTitle = {
    author: 'Test Author',
    url: 'https://testurl.com',
    likes: 5
  }
  await api
    .post('/api/blogs')
    .set({ 'Authorization': `Bearer ${token}` })
    .send(newBlogNoTitle)
    .expect(400);
  expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length);
})

test("successful post deletion with 204 status code", async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
})

test("successful modification of likes property in blog post node", async () => {
  const blogsToUpdate = await helper.blogsInDb();
  const blogToUpdate = blogsToUpdate[blogsToUpdate.length - 1]
  const blogIdToUpdate = blogToUpdate.id

  const blogLikes = {
    likes: 1337
  }

  await api
    .put(`/api/blogs/${blogIdToUpdate}`)
    .send(blogLikes)
    .expect(201)

    const blogsToUpdateEnd = await helper.blogsInDb();
    const blogToUpdateEnd = blogsToUpdateEnd[blogsToUpdateEnd.length - 1]

    expect(blogToUpdateEnd.likes).toBe(1337)

})

describe('administration & authentication tests', () => {
  test("non-existent username responds with 400 & no changes in db", async () => {
    
    const addedUser = {
      name: 'Test Name',
      password: 'testpassword'
    }

    await api
      .post(`/api/users`)
      .send(addedUser)
      .expect(400)


    const usersToAdd = await helper.usersInDb()

    expect(usersToAdd).toHaveLength(helper.initialUsers.length)
  })

  test('not valid password responds with 400 & no changes in db', async () => {
    const addedUser = {
      username: 'testname',
      name: 'Test Name',
      password: 'te'
    }

    await api
      .post(`/api/users`)
      .send(addedUser)
      .expect(400)
    
    const usersToAdd = await helper.usersInDb()
    expect(usersToAdd).toHaveLength(helper.initialUsers.length)
  })
  test('adding a blog fails with 401 Unauthorized when a token is not provided', async () => {
    const newBlogItem = {
      title: 'No token item',
      author: 'Notoken Author',
      url: 'https://notoken.com'
    }

    api
      .post('/api/blogs')
      .send(newBlogItem)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close();
});
