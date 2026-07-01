import { useState, useRef, useEffect } from 'react'

const MAX_CAPACITY = 3

export default function CourseDropdown({ courses, counts = {}, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = courses.find((c) => c.id === Number(value))

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="custom-select" ref={ref}>
      <button type="button" className="custom-select-trigger" onClick={() => setOpen(!open)}>
        <span>{selected ? selected.title : '— Select a course —'}</span>
        <svg className={`chevron ${open ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="custom-select-dropdown">
          {courses.length === 0 && <div className="custom-select-empty">No courses available</div>}
          {courses.map((c) => {
            const enrolled = counts[c.id] || 0
            const remaining = MAX_CAPACITY - enrolled
            const isFull = remaining <= 0
            const isSelected = Number(value) === c.id
            return (
              <div
                key={c.id}
                className={`custom-select-option ${isSelected ? 'selected' : ''} ${isFull ? 'full' : ''}`}
                onClick={() => { if (!isFull) { onChange(c.id); setOpen(false) } }}
              >
                <span>{c.title}</span>
                <span className={`slot-badge ${isFull ? 'full' : ''}`}>
                  {isFull ? 'FULL' : `${remaining} / ${MAX_CAPACITY}`}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
