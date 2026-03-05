const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://127.0.0.1:8000/';

async function request_handler(path, options = {}) {
  let response;
  try {
    console.log("base url = ",`${API_BASE_URL}${path}`);
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        // 'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error('Could not connect to the backend API.');
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const flattenedErrors =
      data?.errors && typeof data.errors === 'object'
        ? Object.values(data.errors)
            .flat()
            .map((value) => String(value))
            .join(' ')
        : '';
    const errorMessage =
      data?.error || flattenedErrors ||
      'Something went wrong. Please try again.';
    const error = new Error(errorMessage);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

export function fetchEmployees(){
    return request_handler('list_employees')
}

export function fetchTodayAttendance(){
    return request_handler('today_attendance')
}

export function deleteEmployeeRecord(emp_id){
    const formData = new FormData();
    formData.append("employee_id", emp_id);

    return request_handler('delete_employee', {
        method: "POST",
        body: formData
    })
}

export function createEmployee(data){
    const formData = new FormData();
    formData.append('employee_id', data['employee_id']);
    formData.append('full_name', data['full_name']);
    formData.append('email', data['email']);
    formData.append('department', data['department']);

    return request_handler('create_employee', {
        method: 'POST',
        body: formData
    })
}

export function saveAttendance(data){
    const formData = new FormData();
    formData.append('employee_id', data['employee_id']);
    formData.append('date', data['date']);
    formData.append('status', data['status']);

    return request_handler('save_attendance', {
        method: 'POST',
        body: formData
    })
}

export function fetchAttendance(emp_id, date){

    const params = new URLSearchParams();
    if (emp_id) params.set('employee_id', emp_id);
    if (date) params.set('date', date);
    const query = params.toString();
    return request_handler(`get_attendance${query ? `?${query}` : ''}`);
}