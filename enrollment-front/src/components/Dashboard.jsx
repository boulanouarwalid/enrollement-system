import { useState, useEffect } from 'react'
import { fetchEnrollments, deleteEnrollment } from '../services/api'

const INSTRUCTOR_MAP = {
  'Web Development Fundamentals': 'Dr. Sarah J.',
  'Data Science & AI': 'Prof. Ben C.',
  'UI/UX Design Masterclass': 'Prof. Linda M.',
  'Advanced Web Engineering': 'Dr. Sarah J.',
  'Digital Marketing Strategy': 'Prof. Ben C.',
  'Introduction to Cyber Security': 'Dr. Khalid A.',
  'Mathematics 101': 'Dr. Euler',
  'Physics 101': 'Dr. Newton',
  'Computer Science 101': 'Prof. Turing',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function relativeTime(dateStr) {
  const now = Date.now()
  const d = new Date(dateStr).getTime()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return formatDateShort(dateStr)
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function getFormattedFullDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getCourseProgress(enrollmentDate) {
  const enrolled = new Date(enrollmentDate).getTime()
  const elapsed = Date.now() - enrolled
  const courseDuration = 30 * 24 * 60 * 60 * 1000
  return Math.min(100, Math.round((elapsed / courseDuration) * 100))
}

function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      {[1, 2, 3].map((i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-line medium" />
          <div className="skeleton-line short" />
        </div>
      ))}
    </div>
  )
}

function EmptyStateNoStudent() {
  return (
    <div className="empty-state-dashboard">
      <svg className="empty-state-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#00A8B5" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M32 20V36M24 28H40" stroke="#00A8B5" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <h3>No Student Selected</h3>
      <p>Enter your CNIE on the left panel to view your enrolled courses and dashboard.</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="empty-state-dashboard">
      <svg className="empty-state-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="12" y="16" width="40" height="32" rx="4" stroke="#00A8B5" strokeWidth="2" />
        <path d="M22 28H42M22 36H36M22 44H30" stroke="#00A8B5" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h3>No Enrollments Yet</h3>
      <p>You haven't enrolled in any courses. Use the <strong>Quick Enroll</strong> form to get started.</p>
    </div>
  )
}

const SERVICES = [
  { name: 'Eureka', key: 'eureka' },
  { name: 'Gateway', key: 'gateway' },
  { name: 'Student API', key: 'student' },
  { name: 'Course API', key: 'course' },
  { name: 'Enrollment API', key: 'enrollment' },
]

function SystemHealth() {
  return (
    <div className="system-health">
      {SERVICES.map((s) => (
        <span className="health-item" key={s.key}>
          <span className="health-dot up" />
          <span className="health-name">{s.name}</span>
        </span>
      ))}
      <span className="health-label">— All operational</span>
    </div>
  )
}

function ActivityTimeline({ enrollments }) {
  const sorted = [...enrollments].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  return (
    <div className="activity-section">
      <h3 className="section-title">Recent Activity</h3>
      <div className="activity-timeline">
        {sorted.map((e, idx) => (
          <div className="activity-item" key={e.enrollmentId} style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="activity-dot" />
            <div className="activity-content">
              <span className="activity-course">{e.courseName || 'Unknown Course'}</span>
              <span className="activity-meta">Enrolled — {relativeTime(e.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard({ student, onEnrolled, showToast }) {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!student) return
    setLoading(true)
    setError(null)
    fetchEnrollments(student.cnie)
      .then((data) => {
        setEnrollments(data || [])
      })
      .catch((err) => {
        setError(err.message || 'Failed to load enrollments')
        setEnrollments([])
      })
      .finally(() => setLoading(false))
  }, [student])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  function timeLeft(enrollmentDate) {
    const created = new Date(enrollmentDate).getTime()
    const deadline = created + 24 * 60 * 60 * 1000
    const diff = deadline - now
    if (diff <= 0) return null
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} LEFT TO UNENROLL`
  }

  function isDeletable(enrollmentDate) {
    const created = new Date(enrollmentDate).getTime()
    return (now - created) < 24 * 60 * 60 * 1000
  }

  async function handleUnenroll(id) {
    try {
      await deleteEnrollment(id)
      setEnrollments((prev) => prev.filter((e) => e.enrollmentId !== id))
      showToast('Enrollment cancelled', 'success')
      onEnrolled()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading) return <DashboardSkeleton />
  if (!student) return <EmptyStateNoStudent />
  if (error) return (
    <div className="loading" style={{ color: '#E85D6F', padding: '40px 0', textAlign: 'center' }}>
      ⚠ {error}
    </div>
  )

  const total = enrollments.length
  const activeCourses = enrollments.filter((e) => isDeletable(e.date)).length
  const completedCourses = total - activeCourses
  const overallProgress = total > 0 ? Math.round((completedCourses / total) * 100) : 0

  return (
    <>
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h2>{getGreeting()}, {student.firstName}</h2>
          <p className="dashboard-date">{getFormattedFullDate()}</p>
        </div>
        <SystemHealth />
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{total}</span>
          <span className="stat-label">Total Enrolled</span>
        </div>
        <div className="stat-card stat-card-active">
          <span className="stat-number">{activeCourses}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card stat-card-completed">
          <span className="stat-number">{completedCourses}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="course-list">
          {enrollments.map((e) => {
            const deletable = isDeletable(e.date)
            const remaining = timeLeft(e.date)
            const instructor = INSTRUCTOR_MAP[e.courseName] || 'Staff'
            const progress = getCourseProgress(e.date)
            return (
              <div className="course-card" key={e.enrollmentId}>
                <div className="course-info">
                  <div className="course-info-top">
                    <h4>{e.courseName || 'Unknown Course'}</h4>
                    <span className={`course-badge ${deletable ? 'badge-active' : 'badge-completed'}`}>
                      {deletable ? 'ACTIVE' : 'COMPLETED'}
                    </span>
                  </div>
                  <div className="course-instructor">{instructor}</div>
                  <div className="course-enrolled-date">Enrolled {formatDate(e.date)}</div>
                  <div className="course-progress">
                    <div className="course-progress-track">
                      <div className="course-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="course-progress-text">{progress}%</span>
                  </div>
                </div>
                <div className="course-actions">
                  {deletable ? (
                    <>
                      <button className="btn-unenroll" onClick={() => handleUnenroll(e.enrollmentId)}>
                        🗑 UNENROLL
                      </button>
                      {remaining && <span className="time-left">{remaining}</span>}
                    </>
                  ) : (
                    <>
                      <button className="btn-unenroll" disabled>
                        🔒 UNENROLL
                      </button>
                      <span className="locked-label">ENROLLED &gt; 24H (Cannot Unenroll)</span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {enrollments.length > 0 && (
        <>
          <div className="progress-section">
            <div className="progress-label">
              <span>Overall Course Completion</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>

          <ActivityTimeline enrollments={enrollments} />

          <div className="quick-links-section">
            <div className="quick-links-title">Quick Links to course materials</div>
            <div className="quick-links-grid">
              {Array.from(new Set(enrollments.map((e) => e.courseName))).slice(0, 4).map((name) => (
                <div className="quick-link-item" key={name}>
                  <div className="quick-link-icon">📘</div>
                  <span className="quick-link-text">{name.split(' ').slice(0, 2).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
