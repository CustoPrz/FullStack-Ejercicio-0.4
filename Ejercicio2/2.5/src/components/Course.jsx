const Part = ({part}) => {
    return(
    <div>
      <li>{part.name} : {part.exercises}</li>
    </div>
    )
  }
const Header = ({ title }) => {
    return (
      <div>
        <h1>{title}</h1>
      </div>
    );
  };
const Course = ({ course }) => {
    const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0);
  
    return (
      <div>
        <Header title={course.name} />
        <ul>
          {course.parts.map(part => (
            <Part key={part.id} part={part} />
          ))}
        </ul>
        <p>Total exercises: {totalExercises}</p>
      </div>
    )
  }
  export default Course