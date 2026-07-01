import { useState, useEffect } from 'react'
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../services/api'

export default function StudentsPage({ showToast }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ cnie: '', firstName: '', lastName: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '' })

  useEffect(() => {
    fetchStudents()
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const created = await createStudent(form)
      setStudents((prev) => [...prev, created])
      setShowForm(false)
      setForm({ cnie: '', firstName: '', lastName: '', email: '' })
      showToast('Student created successfully', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(s) {
    setEditingId(s.id)
    setEditForm({ firstName: s.firstName, lastName: s.lastName, email: s.email || '' })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm({ firstName: '', lastName: '', email: '' })
  }

  async function handleEdit(id) {
    setSaving(true)
    try {
      const updated = await updateStudent(id, editForm)
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)))
      cancelEdit()
      showToast('Student updated', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this student?')) return
    try {
      await deleteStudent(id)
      setStudents((prev) => prev.filter((s) => s.id !== id))
      showToast('Student deleted', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h2>STUDENTS</h2>
          <p className="admin-subtitle">Manage student identities</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ CANCEL' : '+ ADD STUDENT'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group">
              <label>CNIE</label>
              <input required value={form.cnie} onChange={(e) => setForm({ ...form, cnie: e.target.value })} placeholder="e.g. AB123456" />
            </div>
            <div className="form-group">
              <label>EMAIL</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>FIRST NAME</label>
              <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" />
            </div>
            <div className="form-group">
              <label>LAST NAME</label>
              <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" />
            </div>
          </div>
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? 'SAVING...' : 'SAVE STUDENT'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>CNIE</th>
                <th>FIRST NAME</th>
                <th>LAST NAME</th>
                <th>EMAIL</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr><td colSpan={6} className="loading">No students found</td></tr>
              )}
              {students.map((s) => (
                editingId === s.id ? (
                  <tr key={s.id} className="editing-row">
                    <td>{s.id}</td>
                    <td><code>{s.cnie}</code></td>
                    <td><input value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} /></td>
                    <td><input value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} /></td>
                    <td><input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></td>
                    <td className="actions-cell">
                      <button className="btn-success-sm" onClick={() => handleEdit(s.id)} disabled={saving}>💾 Save</button>
                      <button className="btn-secondary-sm" onClick={cancelEdit}>✕</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td><code>{s.cnie}</code></td>
                    <td>{s.firstName}</td>
                    <td>{s.lastName}</td>
                    <td>{s.email || '—'}</td>
                    <td className="actions-cell">
                      <button className="btn-edit-sm" onClick={() => startEdit(s)}>✏️ Edit</button>
                      <button className="btn-danger-sm" onClick={() => handleDelete(s.id)}>🗑 Delete</button>
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
