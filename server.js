const http = require('http');
const url = require('url');
const net = require("net");
const ping = require('ping');
const _ = require('lodash');
const sftpClient = require("ssh2-sftp-client");
const ftpClient = require("ftp");
const fs = require("fs");
const soap = require("soap");
const HttpDispatcher = require('httpdispatcher');
const dispatcher = new HttpDispatcher();
const axios = require("axios");
const services = require("./services.conf.js");


const PORT = 3000;
let API_ENV = process.argv[1] || 'dev';

const sftp = new sftpClient();
const ftp = new ftpClient();

console.log(`Starting w services: ${JSON.stringify(services)}`);

function handleRequest(request, response){
    try {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}
const server = http.createServer(handleRequest);

const ftpConnect = function() {
  this.ftp = host =>
    new Promise(function(resolve, reject) {
      ftp.on("ready", function() {
        resolve(true);
      });
      ftp.on("error", function(err) {
        reject(err);
      });
      ftp.connect(host);
    });

  this.sftp = host =>
    new Promise(function(resolve, reject) {
      sftp
        .connect(host)
        .then(() => {
          resolve(true);
        })
        .catch(err => reject(err));
    });
};

const ftpListRemoteFiles = function() {
  this.ftp = () =>
    new Promise(function(resolve, reject) {
      ftp.list((err, list) => {
        if (err) reject(err);
        ftp.end();
        resolve(list);
      });
    });

  this.sftp = () =>
    new Promise(function(resolve, reject) {
      sftp
        .list("./")
        .then(list => resolve(list))
        .catch(err => reject(err))
        .then(() => sftp.end());
    });
};

const socketService = (config) => {
  console.log(config.ip, config.port)
  return new Promise((resolve, reject) => {
    let chunks = "";
    const client = net
      .createConnection(config.port, config.ip, () => {
        client.write(config.handshake, () => {
          console.log(`Bytes written: ${client.bytesWritten}`);
        });
      })
      .on("error", err => {
        reject(err);
      })
      .setTimeout(config.maxTimeoutReceive);

    client.on("timeout", () => {
      client.end();
    });

    client.on("end", () => {
      resolve(chunks);
    });

    client.on("data", data => {
      if (data) {
        chunks += data;
      }
    }); 
  });
}

const restService = (config) => {
  return axios({
    method: config.method,
    url: config.url,
    data: config.data
  });
}

const pingService = (config) => {
  return ping.promise.probe(config.ip);
}

const soapService = (config) => {
  return new Promise((resolve, reject) => {
    soap
      .createClientAsync(config.wsdl)
      .then(client => {
        _.get(client, config.operation)
        (
          config.body,
          (err, result, raw) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      }).catch(err=>reject(err))
  });
}

const ftpService = async (config) => {
  try {
    await new ftpConnect()[config.host.protocol](config.host);
    return await new ftpListRemoteFiles()[config.host.protocol]();
  } catch (err) {
    throw new Error(err);
  }
}

const promiseTimeout = (ms, promise) => {
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Error Timer out in '+ ms + 'ms.')
    }, ms)
  })
  return Promise.race([
    promise,
    timeout
  ])
}

const sendOk= ({message, end, index}, {name, description, type }) => {
  return {
    index,
    name,
    description,
    type,
    success: true,
    message,
    time: end
  };
}

const sendError = ({errorType, message, end, index}, {name, description, type}) => {
  return {
    index,
    name,
    description,
    type,
    success: false,
    errorType: errorType,
    message: String(message),
    time: end
  };
}

const sendService = async ({type, env: {[API_ENV]: config}}) => {
  if(!config){
   throw new Error(`There is not environment ${API_ENV} for this service`);
  }
  switch (type) {
    case 'socket':
      return socketService(config);
    case 'rest':
      return restService(config);
    case 'soap':
      return soapService(config);
    case 'ping':
      return pingService(config);
    case 'ftp' || 'sftp':
      return ftpService(config);
    default:
      throw new Error("There is not configured service");
  }
}

dispatcher.onGet("/services", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { query } = url.parse(req.url, true);
  let states = [];
  let promises = [];
  API_ENV = query.env || API_ENV;

  services.filter(service=>service.active===true).map((service, index)=>{
    const time = new Date();
    const promise = promiseTimeout(service.timeoutError, sendService(service));
    promises.push(promise);
    promise.then((response)=>{
      const end = new Date() - time;
      response=service.filter ? service.filter(response) : response;
      if(!service.processOk || service.processOk(response)){
        states.push(sendOk({message: response, end, index}, service));
      }else{
        states.push(sendError({errorType: 'logic', message: response, end, index}, service));
      }
    }).catch(err=>{
      const end = new Date() - time;
      states.push(sendError({errorType: 'service', message: err, end, index}, service));
    });
  });
 
  Promise.all(promises.map(p => p.catch(() => undefined))).then(r=>res.end(JSON.stringify(states)))
    .catch(err=>console.log(err))
 });

dispatcher.onError(function(req, res) {
    res.writeHead(404);
    res.end("Error, the URL doesn't exist");
});

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
