import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm.jsx'

test('check the form call with right details when a new blog is created', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog}/>)

  const title = container.querySelector('#title')
  const author = container.querySelector('#author')
  const url = container.querySelector('#url')

  const sendButton = screen.getByText('create')

  await user.type(title, 'Testing title')
  await user.type(author, 'Testing author')
  await user.type(url, 'https://dastest.com')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing title')
  expect(createBlog.mock.calls[0][0].author).toBe('Testing author')
  expect(createBlog.mock.calls[0][0].url).toBe('https://dastest.com')
})