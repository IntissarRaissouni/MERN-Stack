import { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: workout.title,
    load: workout.load,
    reps: workout.reps
  })

  const handleClick = async () => {
    if (!user) {
      return
    }

    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_WORKOUT', payload: json})
    }
  }

  const handleUpdate = async () => {
    if (!user) {
      return
    }
  
    const response = await fetch(`/api/workouts/${workout._id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
  
    const json = await response.json()
  
    if (response.ok) {
      dispatch({ type: 'UPDATE_WORKOUT', payload: json })
      setIsEditing(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div className="workout-details">
      {isEditing ? (
        <div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <input
            type="number"
            name="load"
            value={formData.load}
            onChange={handleChange}
          />
          <input
            type="number"
            name="reps"
            value={formData.reps}
            onChange={handleChange}
          />
          <button onClick={handleUpdate}>Save</button>
        </div>
      ) : (
        <div>
          <h4>{workout.title}</h4>
          <p><strong>Load (kg): </strong>{workout.load}</p>
          <p><strong>Reps: </strong>{workout.reps}</p>
          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
          <span className="material-symbols-outlined edit" onClick={() => setIsEditing(true)}>edit</span>
          <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
      )}
    </div>
  )
}

export default WorkoutDetails