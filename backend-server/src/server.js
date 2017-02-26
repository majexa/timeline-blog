const Path = require('path');
const Inert = require('inert');
const Cors = require('hapi-cors');
var colors = require('colors');

process.on('unhandledRejection', (err, promise) => {
  console.error(`Uncaught error in`, promise);
  console.error(err);
});

const debugRoutes = function(routes) {
  for (let route of routes) {
    console.log(route.method.blue + ' ' + route.path.cyan);
  }
  return routes;
};

module.exports = function (config) {
  const dbConnect = require('./lib/db');
  dbConnect().then((models) => {
    const Hapi = require('hapi');
    const uploadsFolder = Path.join(__dirname, '../uploads');
    console.log('Seraching files here: ' + uploadsFolder);
    const server = new Hapi.Server({
      connections: {
        routes: {
          files: {
            relativeTo: uploadsFolder
          }
        }
      }
    });
    server.connection(config);
    server.register(Inert, (err) => {
      if (err) throw err;
    });
    server.decorate('request', 'db', models);
    server.register([
      {
        register: Cors,
        options: {
          origins: ['*'],
          headers: ['x-request', 'x-requested-with', 'authorization', 'Content-Type']
        }
      },
    ], () => {
      server.route(debugRoutes(require('./lib/crudRoutes/blog')));
      server.start((err) => {
        if (err)
          throw err;
        console.log(`Server running at: ${server.info.uri}`);
      });
    });
  });
};
