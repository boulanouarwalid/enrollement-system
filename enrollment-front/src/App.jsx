import { useState, useCallback } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import QuickEnroll from './components/QuickEnroll'
import Dashboard from './components/Dashboard'
import StudentsPage from './pages/StudentsPage'
import CoursesPage from './pages/CoursesPage'
import Toast from './components/Toast'
import './App.css'

export default function App() {
  const [student, setStudent] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const showToast = useCallback((message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const handleStudentValidated = useCallback((s) => {
    setStudent(s)
    setRefreshKey((k) => k + 1)
  }, [])

  const handleEnrolled = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className="app">
      <div className="bg-circle bg-circle-1" />
      <div className="bg-circle bg-circle-2" />
      <div className="bg-circle bg-circle-3" />
      <div className="bg-circle bg-circle-4" />
      <div className="bg-circle bg-circle-5" />
      <div className="bg-circle bg-circle-6" />
      <div className="bg-circle bg-circle-7" />
      <div className="bg-circle bg-circle-8" />

      <nav className="top-nav">
        <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 18L16 8L26 18" stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14V24H22V14" stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
                <linearGradient id="g1" x1="6" y1="8" x2="26" y2="24">
                  <stop stopColor="#00A8B5"/><stop offset="1" stopColor="#0088CC"/>
                </linearGradient>
            </defs>
          </svg>
          <span className="brand-text">STUDENT SPHERE: <span className="brand-light">Unified Enrollment & Learning</span></span>
        </div>
        <div className="nav-tabs">
          <NavLink to="/" end className="nav-tab">DASHBOARD</NavLink>
          <NavLink to="/students" className="nav-tab">STUDENTS</NavLink>
          <NavLink to="/courses" className="nav-tab">COURSES</NavLink>
        </div>
        <div className="nav-right">
          {student && (
            <div className="nav-student-info">
              <div className="nav-student-avatar">{(student.firstName || student.cnie || '?').charAt(0)}</div>
              <span className="nav-student-name">{student.firstName} {student.lastName}</span>
              <span className="nav-student-cnie">{student.cnie}</span>
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <div className="main-content">
            <div className="left-panel">
              <div className="left-header">
                <h2>NEW ENROLLMENT</h2>
                <p className="left-subtitle">Quick Enroll</p>
              </div>
              <QuickEnroll
                student={student}
                onStudentValidated={handleStudentValidated}
                onEnrolled={handleEnrolled}
                showToast={showToast}
              />
            </div>

            <div className="right-panel">
              <div className="glass">
                <h2>YOUR DASHBOARD</h2>
                <p className="subtitle">MY ENROLLED COURSES</p>
                <Dashboard
                  key={refreshKey}
                  student={student}
                  onEnrolled={handleEnrolled}
                  showToast={showToast}
                />
              </div>
            </div>
          </div>
        } />
        <Route path="/students" element={<StudentsPage showToast={showToast} />} />
        <Route path="/courses" element={<CoursesPage showToast={showToast} />} />
      </Routes>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
