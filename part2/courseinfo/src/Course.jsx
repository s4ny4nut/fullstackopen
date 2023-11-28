const Header = ({ course }) => <h2>{course.name}</h2>

const Total = ({ course }) => {
  const sum = course.parts.reduce((accumulator, current) => accumulator + current.exercises, 0);
  return <p><strong>total of {sum} exercises</strong></p>
}
const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ course }) => {
  const {parts} = course;
  return (
    <>
      <Header course={course}/>
      {parts.map(part => {
        return <Part key={part.id} part={part} />
      })}
      <Total course={course}/>
    </>
  )
}
const Course = ({courses}) => {
  return (
    <>
      <h1>Web development curriculum</h1>
      {courses.map(course => 
        <Content key={course.id} course={course}/>
      )}
    </>
  )
}

export default Course;