const BASE = '/api';

async function handleResponse(resp) {
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `HTTP ${resp.status}`);
  }
  if (resp.status === 204) return null;
  return resp.json();
}

/* ─── Students ─── */
export async function fetchStudents() {
  const resp = await fetch(`${BASE}/students`);
  return handleResponse(resp);
}

export async function createStudent(data) {
  const resp = await fetch(`${BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(resp);
}

export async function updateStudent(id, data) {
  const resp = await fetch(`${BASE}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(resp);
}

export async function deleteStudent(id) {
  const resp = await fetch(`${BASE}/students/${id}`, { method: 'DELETE' });
  return handleResponse(resp);
}

export async function validateStudent(cnie) {
  const resp = await fetch(`${BASE}/students/by-cnie/${cnie}`);
  if (!resp.ok) return null;
  return resp.json();
}

/* ─── Courses ─── */
export async function fetchCourses() {
  const resp = await fetch(`${BASE}/courses`);
  return handleResponse(resp);
}

export async function createCourse(data) {
  const resp = await fetch(`${BASE}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(resp);
}

export async function updateCourse(id, data) {
  const resp = await fetch(`${BASE}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(resp);
}

export async function deleteCourse(id) {
  const resp = await fetch(`${BASE}/courses/${id}`, { method: 'DELETE' });
  return handleResponse(resp);
}

/* ─── Enrollments ─── */
export async function fetchEnrollments(cnie) {
  const resp = await fetch(`${BASE}/enrollments/my/${cnie}`);
  return handleResponse(resp);
}

export async function enrollStudent(studentId, courseId) {
  const resp = await fetch(`${BASE}/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, courseId }),
  });
  return handleResponse(resp);
}

export async function deleteEnrollment(id) {
  const resp = await fetch(`${BASE}/enrollments/${id}`, { method: 'DELETE' });
  return handleResponse(resp);
}

export async function fetchEnrollmentCounts() {
  const resp = await fetch(`${BASE}/enrollments/counts`);
  return handleResponse(resp);
}
