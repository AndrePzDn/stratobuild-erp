const search = async (Model, req, res) => {
  const searchQuery = req.query.q?.trim();
  if (!searchQuery) {
    return res.status(202).json({
      success: false,
      result: [],
      message: 'No document found by this request',
    });
  }

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];
  const regex = new RegExp(searchQuery, 'i');

  const matchConditions = fieldsArray.map((field) => {
    const fieldPath = field.split('.');
    if (fieldPath.length === 2) {
      return { [`${fieldPath[0]}.${fieldPath[1]}`]: { $regex: regex } };
    } else {
      return { [field]: { $regex: regex } };
    }
  });

  const results = await Model.aggregate([
    { $match: { removed: false } },
    {
      $lookup: {
        from: 'resources',
        localField: 'resource',
        foreignField: '_id',
        as: 'resource',
      },
    },
    { $unwind: '$resource' },
    {
      $lookup: {
        from: 'currencies',
        localField: 'currency',
        foreignField: '_id',
        as: 'currency',
      },
    },
    { $unwind: '$currency' },
    {
      $lookup: {
        from: 'providers',
        localField: 'provider',
        foreignField: '_id',
        as: 'provider',
      },
    },
    { $unwind: '$provider' },
    {
      $match: { $or: matchConditions },
    },
    {
      $addFields: {
        label: {
          $concat: ['$resource.name', ' - ', { $toString: '$unitPrice' }, ' - ', '$provider.name'],
        },
      },
    },
    { $limit: 20 },
  ]);

  if (results.length > 0) {
    return res.status(200).json({
      success: true,
      result: results,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(202).json({
      success: false,
      result: [],
      message: 'No document found by this request',
    });
  }
};

module.exports = search;
