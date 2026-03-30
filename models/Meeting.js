import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
  {
    roomName:  { type: String, required: true, unique: true },
    hostId:    { type: String, required: true },
    hostEmail: { type: String, required: true },
    isMuted:   { type: Boolean, default: false },
    quizActive: { type: Boolean, default: false },
    participants: [
      {
        userId:   String,
        name:     String,
        email:    String,
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Meeting ||
  mongoose.model("Meeting", MeetingSchema);