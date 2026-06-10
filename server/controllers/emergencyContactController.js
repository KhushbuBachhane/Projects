import EmergencyContact from '../models/EmergencyContact.js';
import { AppError } from '../middleware/errorHandler.js';

export const getEmergencyContacts = async (req, res, next) => {
  try {
    const contacts = await EmergencyContact.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    next(error);
  }
};

export const createEmergencyContact = async (req, res, next) => {
  try {
    const { name, phone, category, description } = req.body;

    if (!name || !phone || !category) {
      throw new AppError('Please provide name, phone, and category', 400);
    }

    const contact = await EmergencyContact.create({ name, phone, category, description });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

export const updateEmergencyContact = async (req, res, next) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);

    if (!contact) {
      throw new AppError('Emergency contact not found', 404);
    }

    const { name, phone, category, description, isActive } = req.body;

    if (name) contact.name = name;
    if (phone) contact.phone = phone;
    if (category) contact.category = category;
    if (description !== undefined) contact.description = description;
    if (isActive !== undefined) contact.isActive = isActive;

    await contact.save();

    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

export const deleteEmergencyContact = async (req, res, next) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);

    if (!contact) {
      throw new AppError('Emergency contact not found', 404);
    }

    await contact.deleteOne();

    res.json({ success: true, message: 'Emergency contact deleted' });
  } catch (error) {
    next(error);
  }
};
