const paginatedList = async (Model, req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.items) || 1000;
  const skip = (page - 1) * limit;

  const {
    sortBy = 'created',
    sortValue = -1,
    filter,
    equal,
    project,
    q,
    fields: fieldsParam,
  } = req.query;

  const fieldsArray = fieldsParam ? fieldsParam.split(',') : [];

  let searchFilter = {};
  if (fieldsArray.length > 0 && q) {
    searchFilter.$or = fieldsArray.map((field) => ({
      [field]: { $regex: new RegExp(q, 'i') },
    }));
  }

  // Base filter
  const baseFilter = {
    removed: false,
    ...(filter && equal ? { [filter]: equal } : {}),
    ...(project ? { project } : {}), // <-- Filtering by project if present
    ...searchFilter,
  };

  try {
    const resultsPromise = Model.find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .populate()
      .exec();

    const countPromise = Model.countDocuments(baseFilter);

    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    const pages = Math.ceil(count / limit);
    const pagination = { page, pages, count };

    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: true,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving documents',
      error: error.message,
    });
  }
};

module.exports = paginatedList;
