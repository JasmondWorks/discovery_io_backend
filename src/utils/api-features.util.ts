import { Query } from "mongoose";

export class ApiFeatures {
  public query: Query<any, any>;
  private queryString: Record<string, any>;

  constructor(query: Query<any, any>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "startDate",
      "endDate",
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryStr);

    // Date filtering
    if (this.queryString.startDate || this.queryString.endDate) {
      parsedQuery.createdAt = {};
      if (this.queryString.startDate)
        parsedQuery.createdAt.$gte = new Date(
          this.queryString.startDate as string,
        );
      if (this.queryString.endDate)
        parsedQuery.createdAt.$lte = new Date(
          this.queryString.endDate as string,
        );
    }

    // Soft delete filtering (default: only show non-deleted)
    if (this.queryString.deleted === "true") {
      // Show only deleted items if explicitly requested
      parsedQuery.deletedAt = { $ne: null };
    } else if (this.queryString.deleted === "all") {
      // Show both deleted and non-deleted
    } else {
      // Default: show only non-deleted
      parsedQuery.deletedAt = null;
    }

    this.query = this.query.find(parsedQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string).split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = (this.queryString.page as number) * 1 || 1;
    const limit = (this.queryString.limit as number) * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  search(searchFields: string[]) {
    if (this.queryString.search && searchFields.length > 0) {
      const searchTerms = (this.queryString.search as string).split(" ");
      const searchQueries = searchFields.map((field) => ({
        [field]: { $regex: searchTerms.join("|"), $options: "i" },
      }));
      this.query = this.query.find({ $or: searchQueries });
    }
    return this;
  }
}
