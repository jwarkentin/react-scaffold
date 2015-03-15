var restify = require('restify'),
    restErrors = restify.errors,
    nconf = require('nconf');

nconf.require = function require(options) {
    var missing = [];
    for(var i = 0; i < options.length; ++i) {
        if(!nconf.get(options[i])) {
            missing.push(options[i]);
        }
    }

    if(missing.length) {
        throw new Error("Missing required option" + (missing.length > 1 ? 's' : '') + " '" + missing.join("', '") + "'");
    }
}

// Config
nconf.argv().env();

var confFile = nconf.get('config');
if(confFile) {
  nconf.file({
    file: confFile,
    dir: confFile[0] == '/' ? null : process.cwd()
  });
}

try {
  nconf.require(['appName', 'appSrv:host', 'appSrv:port']);
} catch(e) {
  console.error(e.message);
  process.exit(1);
}


var server = restify.createServer({
  name: nconf.get('appName')
});

server.use(restify.gzipResponse());
server.use(require('restify-cookies').parse);
server.use(restify.queryParser());

server.get(/\//, restify.serveStatic({
  directory: './public',
  'default': 'index.html'
}));

server.get(/\/build\//, restify.serveStatic({
  directory: './public/build',
  'default': 'index.html'
}));

server.listen(nconf.get('appSrv:port'), nconf.get('appSrv:host'), function() {
  console.log(`${server.name} listening at ${server.url}`);

  if(process.env.NODE_ENV !== 'production') {
    var webpack = require('webpack');
    var WebpackDevServer = require('webpack-dev-server');
    var webpackConfig = require('./webpack.config');

    webpackConfig.output.publicPath = 'http://' + nconf.get('hotSrv:host') + ':' + nconf.get('hotSrv:port') + '/public/build/';

    //console.log(webpackConfig); process.exit();

    var hotOpts = {
      host: nconf.get('hotSrv:host'),
      port: nconf.get('hotSrv:port')
    };

    new WebpackDevServer(webpack(webpackConfig), {
      publicPath: webpackConfig.output.publicPath,
      hot: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }).listen(hotOpts.port, hotOpts.host, function (err, result) {
      if (err) {
        console.log(err);
      }

      console.log(`Listening at ${hotOpts.host}:${hotOpts.port}`);
    });
  }
});