const dummy = blogs => {
  return 1
}

const totalLikes = blogList => {
  let totalSum = 0;
  blogList.forEach(blog => {
    totalSum = totalSum + blog.likes
  });
  return totalSum;
}

const favoriteBlog = blogList => {
  const favorite = blogList.reduce((prev, curr) => {
    return prev.likes > curr.likes ? prev : curr
  })
  const {title, author, likes} = favorite;
  
  return {
    title,
    author,
    likes
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}