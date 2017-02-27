const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const Hoek = require('hoek');
require('dotenv').config();


const dbConnect = require('../backend-server/src/lib/db');
dbConnect().then((models) => {
  const server = new Hapi.Server({
    connections: {
      routes: {
        files: {
          relativeTo: Path.join(__dirname, '../frontend/public')
        }
      }
    }
  });
  server.connection({port: 8061});
  server.decorate('request', 'db', models);
  server.register(Inert, () => {
  });
  server.register(require('vision'), (err) => {
    Hoek.assert(!err, err);
    server.views({
      engines: {
        html: require('handlebars')
      },
      relativeTo: __dirname,
      path: '../frontend/public'
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
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      request.db.Blog.find().sort({dt: -1}).exec((err, r) => {
        reply.view('index', {
          host: process.env.SERVER_HOST || 'localhost',
          posts: r
        });
      });
    }
  });
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});
