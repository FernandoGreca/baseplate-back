import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiQueryList() {
  const queries = [
    { name: 'limit', type: Number, required: false, example: 10 },
    { name: 'offset', type: Number, required: false, example: 0 },
    {
      name: 'fields',
      type: String,
      required: false,
      example: 'name,email,created_at',
    },
    {
      name: 'sort',
      type: String,
      required: false,
      example: 'name,-created_at',
    },
    {
      name: 'query',
      type: String,
      required: false,
      example: 'name=Fernando&email=abc@xyz.com',
    },
    {
      name: 'dont_count',
      type: Boolean,
      required: false,
      example: false,
    },
  ];

  return applyDecorators(
    ...queries.map((q) =>
      ApiQuery({
        name: q.name,
        type: q.type,
        required: q.required,
        description: `Exemplo: ${q.example}`,
      }),
    ),
  );
}
