import { useState, useEffect } from 'react'
import { validateStudent, fetchCourses, enrollStudent, fetchEnrollmentCounts } from '../services/api'
import CourseDropdown from './CourseDropdown'

export default function QuickEnroll({ student, onStudentValidated, onEnrolled, showToast }) {
  const [cnie, setCnie] = useState('')
  const [cnieStatus, setCnieStatus] = useState('idle')
  const [courses, setCourses] = useState([])
  const [counts, setCounts] = useState({})
  const [selectedCourse, setSelectedCourse] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch(() => {})
    fetchEnrollmentCounts()
      .then(setCounts)
      .catch(() => {})
  }, [])

  async function handleCnieBlur() {
    if (!cnie.trim()) { setCnieStatus('idle'); return }
    const s = await validateStudent(cnie.trim())
    if (s) {
      setCnieStatus('valid')
      onStudentValidated(s)
    } else {
      setCnieStatus('error')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!student || !selectedCourse) return
    setLoading(true)
    try {
      await enrollStudent(student.id, Number(selectedCourse))
      showToast('Enrolled successfully!', 'success')
      setSelectedCourse('')
      const newCounts = await fetchEnrollmentCounts()
      setCounts(newCounts)
      onEnrolled()
    } catch (err) {
      let msg = err.message
      if (msg.includes('already has 3 enrolled')) msg = 'Course is full (max 3 students)'
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = student && selectedCourse && cnieStatus === 'valid'

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>STUDENT CNIE (NATIONAL ID)</label>
        <div className="input-wrapper">
          <input
            className={cnieStatus === 'error' ? 'error' : cnieStatus === 'valid' ? 'valid' : ''}
            placeholder="Enter your CNIE..."
            value={cnie}
            onChange={(e) => { setCnie(e.target.value); setCnieStatus('idle') }}
            onBlur={handleCnieBlur}
          />
        </div>
        {cnieStatus === 'error' && (
          <div className="field-error">⚠ Invalid CNIE format / STUDENT NOT FOUND</div>
        )}
        {cnieStatus === 'valid' && (
          <div className="field-valid">✓ Valid CNIE ({cnie})</div>
        )}
      </div>

      <div className="form-group">
        <label>COURSE SELECTION</label>
        <CourseDropdown
          courses={courses}
          counts={counts}
          value={selectedCourse}
          onChange={setSelectedCourse}
        />
      </div>

      <button className="btn-enroll" type="submit" disabled={!canSubmit || loading}>
        {loading ? 'ENROLLING...' : 'ENROLL NOW →'}
      </button>
    </form>
  )
}
