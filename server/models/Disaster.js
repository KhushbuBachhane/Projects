import mongoose from 'mongoose';

const CATEGORIES = ['Flood', 'Fire', 'Earthquake', 'Accident', 'Storm', 'Landslide'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

const disasterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES,
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: SEVERITIES,
      default: 'Medium',
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    image: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

disasterSchema.index({ category: 1, severity: 1, createdAt: -1 });
disasterSchema.index({ latitude: 1, longitude: 1 });

export { CATEGORIES, SEVERITIES };
const Disaster = mongoose.model('Disaster', disasterSchema);
export default Disaster;
