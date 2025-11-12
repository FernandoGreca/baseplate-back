// base.service.ts
import { Model, Document } from 'mongoose';
import qs from 'query-string';

const COMPARISON_OPERATOR_MAP: Record<string, string> = {
  gt: '$gt',
  gte: '$gte',
  lt: '$lt',
  lte: '$lte',
};

const parseKey = (rawKey: string) => {
  const match = rawKey.match(/^([^\[\]]+)(?:\[(.+)\])?$/);
  return {
    field: match ? match[1] : rawKey,
    operator: match && match[2] ? match[2].toLowerCase() : undefined,
  };
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getSchemaType = (schemaPath: any): string | undefined => {
  if (!schemaPath) return undefined;
  if (schemaPath.instance === 'Array') {
    return schemaPath.caster?.instance;
  }
  return schemaPath.instance;
};

const castComparableValue = (value: string | number | boolean | Date, type?: string): number | Date | null => {
  if (type === 'Number') {
    const num = typeof value === 'number' ? value : Number(value);
    return Number.isNaN(num) ? null : num;
  }
  if (type === 'Date') {
    const date = value instanceof Date ? value : new Date(value as string | number);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
};

const ensureObjectFilter = (current: unknown) => {
  if (current && typeof current === 'object' && !(current instanceof RegExp) && !(current instanceof Date)) {
    return current as Record<string, unknown>;
  }
  return {};
};

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

    const filter: any = {};

    // Filtro específico via query string com operadores dinâmicos por tipo
    if (query) {
      const parsed = qs.parse(query, { arrayFormat: 'bracket' });
      Object.keys(parsed).forEach((rawKey) => {
        const { field, operator } = parseKey(rawKey);
        const schemaPath = this.model.schema.paths[field];
        const schemaType = getSchemaType(schemaPath);
        if (!schemaType) return;

        const value = parsed[rawKey];
        const valuesArray = Array.isArray(value) ? value : [value];

        valuesArray.forEach((entry) => {
          if (entry === null || entry === undefined) return;

          if (schemaType === 'String') {
            const stringValue = String(entry);
            filter[field] =
              operator === 'contains'
                ? new RegExp(escapeRegex(stringValue), 'i')
                : new RegExp(`^${escapeRegex(stringValue)}$`, 'i');
            return;
          }

          if (schemaType === 'Number' || schemaType === 'Date') {
            const castedValue = castComparableValue(entry, schemaType);
            if (castedValue === null) return;

            const mongoOperator = operator ? COMPARISON_OPERATOR_MAP[operator] : undefined;
            if (mongoOperator) {
              const condition = ensureObjectFilter(filter[field]);
              condition[mongoOperator] = castedValue;
              filter[field] = condition;
              return;
            }

            const eqCondition = ensureObjectFilter(filter[field]);
            eqCondition.$eq = castedValue;
            filter[field] = eqCondition;
            return;
          }

          // fallback para tipos não suportados
          filter[field] = entry;
        });
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
