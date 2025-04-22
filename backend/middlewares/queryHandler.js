"use strict";

const queryHandler = async (req, res, next) => {
  const filter = req.query?.filter || {};

  const search = req.query?.search || {};

  for (let key in search) search[key] = { $regex: search[key] };

  const sort = req.query?.sort || {};

  let limit = Number(req.query?.limit);
  limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE || 20);

  let page = Number(req.query?.page);
  page = page > 0 ? page : 1;

  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : (page - 1) * limit;

  res.getModelList = async function (Model, populate = null) {
    return await Model.find({ ...filter, ...search })
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate(populate);
  };

  res.getModelListDetails = async (Model) => {
    const data = Model.find({ ...filter, ...search });

    const details = {
      filter: filter,
      search,
      sort,
      skip,
      limit,
      page,
      pages: {
        previous: page > 1 ? page - 1 : false,
        current: page,
        next: page + 1,
        total: Math.ceil(data.length / limit),
      },
      totalRecords: data.length,
    };

    details.pages.next =
      details.pages.next > details.pages.total ? false : details.pages.next;
    if (details.totalRecords <= limit) details.pages = false;
    return details;
  };

  next();
};

module.exports = queryHandler;
