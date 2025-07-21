const paginatedProjectInventoryItems = async (Model, req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = (page - 1) * limit;

  const { sortBy = 'created', sortValue = -1, filter, equal, projectId } = req.query;

  const filterQuery = {
    removed: false,
    ...(projectId ? { project: projectId } : {}),
  };

  try {
    const inventories = await Model.find(filterQuery)
      .sort({ [sortBy]: sortValue })
      .populate()
      .exec();

    let allItems = [];

    inventories.forEach((inventory) => {
      const itemsWithParent = inventory.items.map((item) => ({
        ...item.toObject(),
        created: inventory.created,
        updated: inventory.updated,
      }));
      allItems = [...allItems, ...itemsWithParent];
    });

    const count = allItems.length;
    const pages = Math.ceil(count / limit);

    const paginatedItems = allItems.slice(skip, skip + limit);

    const pagination = { page, pages, count };

    if (paginatedItems.length > 0) {
      return res.status(200).json({
        success: true,
        result: paginatedItems,
        pagination,
        message: 'Successfully paginated items from ProjectInventory',
      });
    } else {
      return res.status(203).json({
        success: true,
        result: [],
        pagination,
        message: 'No items found',
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

module.exports = paginatedProjectInventoryItems;
