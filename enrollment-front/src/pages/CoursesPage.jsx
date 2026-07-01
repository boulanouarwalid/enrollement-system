import { useState, useEffect } from 'react'
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../services/api'

export default function CoursesPage({ showToast }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', credits: 0 })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', credits: 0 })

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const created = await createCourse({ ...form, credits: Number(form.credits) || 0 })
      setCourses((prev) => [...prev, created])
      setShowForm(false)
      setForm({ title: '', description: '', credits: 0 })
      showToast('Course created successfully', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(c) {
    setEditingId(c.id)
    setEditForm({ title: c.title, description: c.description || '', credits: c.credits || 0 })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm({ title: '', description: '', credits: 0 })
  }

  async function handleEdit(id) {
    setSaving(true)
    try {
      const updated = await updateCourse(id, { ...editForm, credits: Number(editForm.credits) || 0 })
      setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)))
      cancelEdit()
      showToast('Course updated', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this course?')) return
    try {
      await deleteCourse(id)
      setCourses((prev) => prev.filter((c) => c.id !== id))
      showToast('Course deleted', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h2>COURSES</h2>
          <p className="admin-subtitle">Manage course catalog</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ CANCEL' : '+ ADD COURSE'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>TITLE</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Course title" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>CREDITS</label>
              <input type="number" min="0" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>DESCRIPTION</label>
            <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Course description" />
          </div>
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? 'SAVING...' : 'SAVE COURSE'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>TITLE</th>
                <th>DESCRIPTION</th>
                <th>CREDITS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 && (
                <tr><td colSpan={5} className="loading">No courses found</td></tr>
              )}
              {courses.map((c) => (
                editingId === c.id ? (
                  <tr key={c.id} className="editing-row">
                    <td>{c.id}</td>
                    <td><input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></td>
                    <td><input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} /></td>
                    <td><input type="number" min="0" value={editForm.credits} onChange={(e) => setEditForm({ ...editForm, credits: e.target.value })} /></td>
                    <td className="actions-cell">
                      <button className="btn-success-sm" onClick={() => handleEdit(c.id)} disabled={saving}>💾 Save</button>
                      <button className="btn-secondary-sm" onClick={cancelEdit}>✕</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td><strong>{c.title}</strong></td>
                    <td className="text-muted">{c.description || '—'}</td>
                    <td>{c.credits}</td>
                    <td className="actions-cell">
                      <button className="btn-edit-sm" onClick={() => startEdit(c)}>✏️ Edit</button>
                      <button className="btn-danger-sm" onClick={() => handleDelete(c.id)}>🗑 Delete</button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
