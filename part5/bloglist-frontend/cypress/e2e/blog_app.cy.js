describe('Blog app', function() {
  beforeEach(function(){
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.createUserToBackend({
      username: 'test-user-two', 
      password: 'test-user-two',
      name: 'Test User Two'
    })
    cy.visit('')
  })
  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })
  
  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.login({ username: 'test-user-two', password: 'test-user-two' })
    })
    it('fails with wrong credentials', function() {
      cy.get('#username').type('wrong-username')
      cy.get('#password').type('wrong-password')
      cy.get('#loginButton').click()
      cy.get('.error').should('contain', 'Wrong credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.error').should('have.css', 'border-color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'test-user-two', password: 'test-user-two' })
    })
    it('A blog can be created', function() {
      cy.createBlog({
        title: 'Test Title',
        author: 'Testis Authorier',
        url: 'https://testurl.com'
      })
      cy.contains('Test Title Testis Authorier')
    })
    it('users can like a blog', function() {
      cy.createBlog({
        title: 'Test Title',
        author: 'Testis Authorier',
        url: 'https://testurl.com'
      })
      cy.get('#toggleVisibility').click()
      cy.contains('likes: 0')
      cy.get('#likePost').click()
      cy.contains('likes: 1')
    })
    it('the user who created a blog can delete it', function() {
      cy.createBlog({
        title: 'Test Title',
        author: 'Testis Authorier',
        url: 'https://testurl.com'
      })
      cy.contains('Test Title')
      cy.get('#toggleVisibility').click()
      cy.get('#deleteBlog').click()
    })
    it('only the creator can see the delete button of a blog', function() {
      cy.createBlog({
        title: 'Test Title',
        author: 'Testis Authorier',
        url: 'https://testurl.com'
      })
      cy.contains('Delete')
      cy.get('#logoutButton').click()
      cy.createUserToBackend({
        username: 'test-user-one', 
        password: 'test-user-one',
        name: 'Test User One'
      })
      cy.login({ 
        username: 'test-user-one', 
        password: 'test-user-one' 
      })
      cy.get('#toggleVisibility').click()
      cy.get('.blogWrapper').children().find('button').should('not.contain', 'Delete')
    })
    it('the blogs are ordered according to likes with the blog with the most likes being first', function() {
      cy.createBlog({
        title: 'Test Title',
        author: 'Testis Authorier',
        url: 'https://testurl.com'
      })    
      cy.createBlog({
        title: 'Test Title 2',
        author: 'Testis Authorier 2',
        url: 'https://testurl2.com'
      })
      cy.get('.blogWrapper').eq(0).should('contain', 'Test Title').as('firstPost')
      cy.get('.blogWrapper').eq(1).should('contain', 'Test Title 2').as('secondPost')
      cy.get('@firstPost').find('#toggleVisibility').click()
      cy.get('@secondPost').find('#toggleVisibility').click()
      cy.clock()
      cy.get('@firstPost').find('#likePost').click()
      cy.tick(3000)
      cy.get('@secondPost').find('#likePost').click()
      cy.tick(3000)
      cy.get('.blogWrapper').eq(0).should('contain', 'Test Title 2')
    })
  })
})