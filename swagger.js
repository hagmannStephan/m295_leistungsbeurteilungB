// Used to create the swagger.json file (source: https://swagger-autogen.github.io/docs/getting-started/quick-start)
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My Tasks-API',
    description: 'My Tasks-API for the practical exam in den UeK 295'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger.json';
const routes = ['./task.js'];

swaggerAutogen(outputFile, routes, doc);