import Disaster from '../models/Disaster.js';
import User from '../models/User.js';

export const getStats = async (req, res, next) => {
  try {
    const [
      totalDisasters,
      verifiedDisasters,
      totalUsers,
      byCategory,
      bySeverity,
      recentDisasters,
    ] = await Promise.all([
      Disaster.countDocuments(),
      Disaster.countDocuments({ verified: true }),
      User.countDocuments(),
      Disaster.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Disaster.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Disaster.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('reportedBy', 'name'),
    ]);

    const last7Days = await Disaster.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalDisasters,
        verifiedDisasters,
        unverifiedDisasters: totalDisasters - verifiedDisasters,
        totalUsers,
        byCategory,
        bySeverity,
        last7Days,
        recentDisasters,
      },
    });
  } catch (error) {
    next(error);
  }
};
