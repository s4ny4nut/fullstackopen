import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'


const blog = {
  author: 'Test Author',
  title: 'Test Title',
  likes: 3,
  url: 'https://testurl.com',
  user: {
    name: 'Test User Name'
  }
}

test('Blog renders title and author but not it\'s url and likes', () => {
  const mockHandler = jest.fn()

  const { container } = render(
    <Blog blog={blog} addLike={mockHandler} deleteBlog={mockHandler} user={blog}/>
  )
  const div = container.querySelector('.blogWrapper')

  expect(div).toHaveTextContent('Test Author')
  expect(div).toHaveTextContent('Test Title')
  expect(screen.queryByText(/3/)).not.toBeVisible()
  expect(screen.queryByText(/https:\/\/testurl.com/)).not.toBeVisible()
})

test('url and likes are visible on show click', async() => {
  const mockHandler = jest.fn()

  const { container } = render(
    <Blog blog={blog} addLike={mockHandler} deleteBlog={mockHandler} user={blog}/>
  )
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  expect(screen.queryByText(/3/)).toBeVisible()
  expect(screen.queryByText(/https:\/\/testurl.com/)).toBeVisible()
})

test('like button called twice', async () => {
  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} addLike={mockHandler} deleteBlog={mockHandler} user={blog}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

