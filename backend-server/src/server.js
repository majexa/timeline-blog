const Path = require('path');
const Inert = require('inert');
const Cors = require('hapi-cors');
const colors = require('colors');
const Hoek = require('hoek');
require('dotenv').config();

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
            relativeTo: Path.join(__dirname, '../../build/public')
          }
        }
      }
    });
    server.connection(config);
    server.register(Inert, (err) => {
      if (err) throw err;
    });

    server.register(require('vision'), (err) => {
      Hoek.assert(!err, err);
      server.views({
        engines: {
          html: require('handlebars')
        },
        relativeTo: __dirname,
        path: '../../build/public'
      });
    });

    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          redirectToSlash: true,
          index: true
        }
      }
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

      server.route([
        {
          method: 'GET',
          path: '/',
          handler: (request, reply) => {
            reply.view('index', {
              serverUrl: process.env.serverUrl
            });
          }
        }
      ]);

      server.start((err) => {
        if (err)
          throw err;
        console.log(`Server running at: ${server.info.uri}`);
      });
    });
  });
};
