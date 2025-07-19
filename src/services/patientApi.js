import axios from 'axios';

const BASE_URL = 'https://c6zfxs18-5000.inc1.devtunnels.ms';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Health Records
export const uploadHealthRecord = async (data, token) => {
  return api.post('/api/health-records', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getHealthRecords = async (token) => {
  return api.get('/api/health-records', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteHealthRecord = async (recordId, token) => {
  return api.delete(`/api/health-records/${recordId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Appointments
export const getAppointmentHistory = async (token) => {
  return api.get('/api/appointments/history', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUpcomingAppointments = async (token) => {
  return api.get('/api/appointments/upcoming', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Prescriptions
export const getPrescriptions = async (token) => {
  return api.get('/api/prescriptions', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const downloadPdfPrescription = async (prescriptionId, token) => {
  return api.get(`/api/prescriptions/${prescriptionId}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
};

// Notifications
export const getNotifications = async (token) => {
  return api.get('/api/notifications', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const markNotificationAsRead = async (notificationId, token) => {
  return api.put(`/api/notifications/${notificationId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Video Call
export const joinVideoCall = async (appointmentId, token) => {
  return api.get(`/api/appointments/${appointmentId}/join-video-call`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  uploadHealthRecord,
  getHealthRecords,
  deleteHealthRecord,
  getAppointmentHistory,
  getUpcomingAppointments,
  getPrescriptions,
  downloadPdfPrescription,
  getNotifications,
  markNotificationAsRead,
  joinVideoCall,
}; 