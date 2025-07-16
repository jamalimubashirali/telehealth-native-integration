import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [{
    name: String,
    dosage: String,
    instructions: String,
  }],
  notes: { type: String },
  date: { type: Date, default: Date.now },
  pdfUrl: { type: String },
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription; 