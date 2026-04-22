import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaintTicket extends Document {
  ticketNumber: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  name: string;
  email: string;
  phone: string;
  details: string;
  attachmentLink: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  adminNotes: string;
}

const complaintTicketSchema = new Schema<IComplaintTicket>(
  {
    ticketNumber: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    details: { type: String, required: true },
    attachmentLink: { type: String, default: '' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IComplaintTicket>('ComplaintTicket', complaintTicketSchema);
