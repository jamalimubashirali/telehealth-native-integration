import axios from 'axios';

const BASE_URL = 'https://c6zfxs18-5000.inc1.devtunnels.ms';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Dashboard
export const getDoctorDashboard = async (token) => {
  return api.get('/api/doctor/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Appointments
export const getDoctorUpcomingAppointments = async (token) => {
  return api.get('/api/doctor/appointments/upcoming', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getConsultationHistory = async (token) => {
  return api.get('/api/doctor/consultations/history', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Patient Profile & Consultation
export const getPatientProfileAndConsultation = async (patientId, token) => {
  return api.get(`/api/doctor/patient/${patientId}/profile-consultation`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Availability
export const setOrUpdateAvailability = async (data, token) => {
  return api.put('/api/doctor/availability', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Video Call
export const joinDoctorVideoCall = async (appointmentId, token) => {
  return api.get(`/api/doctor/appointments/${appointmentId}/join-video-call`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Record Notes, Diagnosis, Prescription
export const recordConsultationNotes = async (data, token) => {
  return api.post('/api/doctor/consultations/notes', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Notifications
export const getDoctorNotifications = async (token) => {
  return api.get('/api/doctor/notifications', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Earning Negotiation
export const getEarningNegotiation = async (token) => {
  return api.get('/api/doctor/earning-negotiation', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const postNegotiationMessage = async (data, token) => {
  return api.post('/api/doctor/negotiation-message', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  getDoctorDashboard,
  getDoctorUpcomingAppointments,
  getConsultationHistory,
  getPatientProfileAndConsultation,
  setOrUpdateAvailability,
  joinDoctorVideoCall,
  recordConsultationNotes,
  getDoctorNotifications,
  getEarningNegotiation,
  postNegotiationMessage,
}; 