const paginatedList = async (Model, req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = (page - 1) * limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
  const q = req.query.q || '';

  if (Model.modelName === 'PriceBank') {
    const matchStage = {
      removed: false,
    };

    if (filter && equal !== undefined) {
      matchStage[filter] = equal;
    }

    const pipeline = [
      {
        $lookup: {
          from: 'resources', // nombre de la colección relacionada
          localField: 'resource',
          foreignField: '_id',
          as: 'resource',
        },
      },
      { $unwind: '$resource' },
      { $match: matchStage },
    ];

    // Búsqueda por campos (regex)
    if (fieldsArray.length > 0 && q) {
      const orConditions = fieldsArray.map((field) => ({
        [field]: { $regex: new RegExp(q, 'i') },
      }));
      pipeline.push({ $match: { $or: orConditions } });
    }

    pipeline.push({ $sort: { [sortBy]: parseInt(sortValue) } }, { $skip: skip }, { $limit: limit });

    const result = await Model.aggregate(pipeline).exec();

    // Contar total con mismo pipeline
    const countPipeline = [...pipeline];
    countPipeline.splice(countPipeline.length - 3); // remove skip, sort, limit
    countPipeline.push({ $count: 'count' });

    const countResult = await Model.aggregate(countPipeline).exec();
    const count = countResult[0]?.count || 0;
    const pages = Math.ceil(count / limit);
    const pagination = { page, pages, count };

    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: count > 0 ? 'Successfully found all documents' : 'Collection is Empty',
    });
  }

  // Comportamiento por defecto para otros modelos
  const fields = fieldsArray.length === 0 ? {} : { $or: [] };
  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(q, 'i') } });
  }

  const query = {
    removed: false,
    [filter]: equal,
    ...fields,
  };

  const resultsPromise = Model.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortValue })
    .populate()
    .exec();

  const countPromise = Model.countDocuments(query);
  const [result, count] = await Promise.all([resultsPromise, countPromise]);
  const pages = Math.ceil(count / limit);
  const pagination = { page, pages, count };

  return res.status(count > 0 ? 200 : 203).json({
    success: true,
    result: count > 0 ? result : [],
    pagination,
    message: count > 0 ? 'Successfully found all documents' : 'Collection is Empty',
  });
};

module.exports = paginatedList;
