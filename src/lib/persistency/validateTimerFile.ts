import Ajv from 'ajv';

const ajv = new Ajv();

const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      accumulatedTime: {
        type: 'integer',
      },
      time: {
        type: 'integer',
      },
      name: {
        type: 'string',
      },
      id: {
        type: 'string',
      },
    },
    required: ['accumulatedTime', 'time', 'name', 'id'],
  },
};

export default ajv.compile(schema);