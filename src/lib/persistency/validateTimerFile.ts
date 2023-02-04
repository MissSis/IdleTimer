import Ajv from 'ajv';

const ajv = new Ajv();

const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      accumulated: {
        type: 'integer',
      },
      time: {
        type: 'integer',
      },
      title: {
        type: 'string',
      },
      id: {
        type: 'string',
      },
    },
    required: ['accumulated', 'time', 'title', 'id'],
  },
};

export default ajv.compile(schema);