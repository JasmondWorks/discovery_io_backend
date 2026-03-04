import { Document, Model } from "mongoose";
import { ApiFeatures } from "../utils/api-features.util";

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  createMany(data: Partial<T>[]): Promise<T[]>;
  findAll(
    queryParams?: Record<string, any>,
    filter?: Record<string, any>,
    searchFields?: string[],
    populate?: any,
  ): Promise<PaginatedResult<T>>;
  findById(id: string): Promise<T | null>;
  findOne(filter: Record<string, any>): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  deleteMany(filter: Record<string, any>): Promise<boolean>;
}

export class MongooseRepository<
  T extends Document,
> implements IBaseRepository<T> {
  private _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this._model.create(data);
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    return (await this._model.insertMany(data)) as unknown as T[];
  }

  async findAll(
    queryParams: Record<string, any> = {},
    filter: Record<string, any> = {},
    searchFields: string[] = [],
    populate?: any,
  ): Promise<PaginatedResult<T>> {
    const queryBuilder = this._model.find(filter);
    const features = new ApiFeatures(queryBuilder, queryParams)
      .filter()
      .sort()
      .limitFields()
      .search(searchFields);

    const total = await (features.query.clone() as any).countDocuments();
    features.paginate();

    if (populate) {
      features.query.populate(populate);
    }

    const data = await features.query.exec();
    const page = (queryParams.page as number) * 1 || 1;
    const limit = (queryParams.limit as number) * 1 || 10;
    const totalPages = Math.ceil(total / limit);

    return { data, page, limit, total, totalPages };
  }

  async findById(id: string): Promise<T | null> {
    return await this._model.findById(id);
  }

  async findOne(filter: Record<string, any>): Promise<T | null> {
    return await this._model.findOne(filter);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this._model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this._model.findByIdAndDelete(id);
    return !!result;
  }

  async deleteMany(filter: Record<string, any>): Promise<boolean> {
    const result = await this._model.deleteMany(filter);
    return result.acknowledged;
  }
}
