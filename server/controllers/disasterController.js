import Disaster, { CATEGORIES, SEVERITIES } from '../models/Disaster.js';
import { AppError } from '../middleware/errorHandler.js';

export const getDisasters = async (req, res, next) => {
  try {
    const { category, severity, search, startDate, endDate, verified, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (verified !== undefined) filter.verified = verified === 'true';

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [disasters, total] = await Promise.all([
      Disaster.find(filter)
        .populate('reportedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Disaster.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: disasters,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDisasterById = async (req, res, next) => {
  try {
    const disaster = await Disaster.findById(req.params.id).populate('reportedBy', 'name email');

    if (!disaster) {
      throw new AppError('Disaster report not found', 404);
    }

    res.json({ success: true, data: disaster });
  } catch (error) {
    next(error);
  }
};

export const createDisaster = async (req, res, next) => {
  try {
    const { title, description, category, severity, latitude, longitude } = req.body;

    if (!title || !description || !category || !latitude || !longitude) {
      throw new AppError('Please provide all required fields', 400);
    }

    if (!CATEGORIES.includes(category)) {
      throw new AppError(`Invalid category. Must be one of: ${CATEGORIES.join(', ')}`, 400);
    }

    if (severity && !SEVERITIES.includes(severity)) {
      throw new AppError(`Invalid severity. Must be one of: ${SEVERITIES.join(', ')}`, 400);
    }

    const disaster = await Disaster.create({
      title,
      description,
      category,
      severity: severity || 'Medium',
      latitude: Number(latitude),
      longitude: Number(longitude),
      image: req.file ? `/uploads/${req.file.filename}` : null,
      reportedBy: req.user._id,
    });

    const populated = await disaster.populate('reportedBy', 'name email');

    req.io?.emit('newDisaster', populated);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

export const updateDisaster = async (req, res, next) => {
  try {
    const disaster = await Disaster.findById(req.params.id);

    if (!disaster) {
      throw new AppError('Disaster report not found', 404);
    }

    const isOwner = disaster.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('Not authorized to update this report', 403);
    }

    const { title, description, category, severity, latitude, longitude } = req.body;

    if (title) disaster.title = title;
    if (description) disaster.description = description;
    if (category) disaster.category = category;
    if (severity) disaster.severity = severity;
    if (latitude) disaster.latitude = Number(latitude);
    if (longitude) disaster.longitude = Number(longitude);
    if (req.file) disaster.image = `/uploads/${req.file.filename}`;

    await disaster.save();
    const populated = await disaster.populate('reportedBy', 'name email');

    req.io?.emit('disasterUpdated', populated);

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

export const deleteDisaster = async (req, res, next) => {
  try {
    const disaster = await Disaster.findById(req.params.id);

    if (!disaster) {
      throw new AppError('Disaster report not found', 404);
    }

    const isOwner = disaster.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('Not authorized to delete this report', 403);
    }

    await disaster.deleteOne();

    req.io?.emit('disasterDeleted', { _id: req.params.id });

    res.json({ success: true, message: 'Disaster report deleted' });
  } catch (error) {
    next(error);
  }
};

export const verifyDisaster = async (req, res, next) => {
  try {
    const disaster = await Disaster.findById(req.params.id);

    if (!disaster) {
      throw new AppError('Disaster report not found', 404);
    }

    disaster.verified = true;
    await disaster.save();

    const populated = await disaster.populate('reportedBy', 'name email');

    req.io?.emit('disasterVerified', populated);

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

export const updateSeverity = async (req, res, next) => {
  try {
    const { severity } = req.body;

    if (!severity || !SEVERITIES.includes(severity)) {
      throw new AppError(`Invalid severity. Must be one of: ${SEVERITIES.join(', ')}`, 400);
    }

    const disaster = await Disaster.findById(req.params.id);

    if (!disaster) {
      throw new AppError('Disaster report not found', 404);
    }

    disaster.severity = severity;
    await disaster.save();

    const populated = await disaster.populate('reportedBy', 'name email');

    req.io?.emit('severityUpdated', populated);

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};
