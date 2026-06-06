class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findById(id, populateOpts = '') {
    return this.model.findById(id).populate(populateOpts);
  }

  async findOne(filter, populateOpts = '', selectOpts = '') {
    return this.model.findOne(filter).select(selectOpts).populate(populateOpts);
  }

  async find(filter = {}, queryOpts = {}, populateOpts = '') {
    const { sort = { createdAt: -1 }, limit = 20, skip = 0, select = '' } = queryOpts;
    return this.model
      .find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .select(select)
      .populate(populateOpts);
  }

  async updateById(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async updateOne(filter, data) {
    return this.model.findOneAndUpdate(filter, data, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  async deleteOne(filter) {
    return this.model.findOneAndDelete(filter);
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

export default BaseRepository;
