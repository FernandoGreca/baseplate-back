// base.service.ts
import { Model, Document } from 'mongoose';
import qs from 'query-string';

interface FindAllOptions {
  limit?: number;
  offset?: number;
  fields?: string;
  sort?: string;
  query?: string;
  dont_count?: boolean;
}

export class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findAll(options: FindAllOptions = {}) {
    const { limit = 10, offset = 0, fields, sort, dont_count, query } = options;

    let filter: any = {};

    // Filtro específico via query string
    if (query) {
      const parsed = qs.parse(query);
      Object.keys(parsed).forEach((key) => {
        const value = parsed[key];
        // Se o campo existe no schema, adiciona ao filtro
        if (this.model.schema.paths[key]) {
          filter[key] = value;
        }
      });
    }

    let dbQuery = this.model.find(filter);

    if (fields) dbQuery = dbQuery.select(fields.split(',').join(' '));
    if (sort) dbQuery = dbQuery.sort(sort.split(',').join(' '));

    dbQuery = dbQuery.skip(offset).limit(limit);

    const results = await dbQuery.exec();

    if (dont_count) {
      return {
        count: results.length,
        limit,
        offset,
        results,
      };
    }

    const total = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return {
      total,
      count: results.length,
      limit,
      offset,
      total_pages: totalPages,
      current_page: currentPage,
      results,
    };
  }
}
