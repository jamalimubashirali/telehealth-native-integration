import axios from 'axios';

const BASE_URL = 'https://mrvwhr8v-5000.inc1.devtunnels.ms';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Book Appointment (Patient)
export const bookAppointment = async (data, token) => {
  return api.post('/api/appointments', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Accept Appointment (Doctor)
export const acceptAppointment = async (appointmentId, token) => {
  return api.put(`/api/appointments/${appointmentId}/accept`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Complete Appointment (Doctor)
export const completeAppointment = async (appointmentId, data, token) => {
  return api.put(`/api/appointments/${appointmentId}/complete`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Cancel Appointment (Patient or Doctor)
export const cancelAppointment = async (appointmentId, data, token) => {
  return api.put(`/api/appointments/${appointmentId}/cancel`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get Available Slots for a Doctor
export const getAvailableSlots = async (doctorId, date) => {
  return api.get(`/api/doctors/${doctorId}/slots`, { params: { date } });
};

// Calendar Integration (Placeholder)
export const getCalendarIntegration = async (token) => {
  return api.get('/api/calendar', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Trigger Missed Appointments (Admin)
export const triggerMissedAppointments = async (data, token) => {
  return api.post('/api/appointments/missed', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Doctor's public profile/Availability
export const getDoctorPublicProfile = async (doctorId) => {
  return api.get(`/api/doctors/${doctorId}/public-profile`);
};

// Admin audit log
export const getAdminAuditLog = async (token) => {
  return api.get('/api/admin/audit-log', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  bookAppointment,
  acceptAppointment,
  completeAppointment,
  cancelAppointment,
  getAvailableSlots,
  getCalendarIntegration,
  triggerMissedAppointments,
  getDoctorPublicProfile,
  getAdminAuditLog,
}; 