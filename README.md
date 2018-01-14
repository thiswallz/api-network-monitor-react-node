# API/Network Monitoring Tools - React/Redux/Node 

Back-end: This is a (mostly) pure JavaScript implementation using current libs adn node. 
Front-end: This was made with Reactjs, Redux, Thux.

The code is clean in order to learn from there and extend it.

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to install nodejs before


### Installing

Once you get node, you need to install the packages from package.json, then run react and nodejs separatly.

```
> git clone https://github.com/thiswallz/redue.git
> cd redu
> npm i
> node server.js
> npm start 

```
### Services configurations

Inside the root folder, there is a file for configurate all services you want to TEST, 
It is: services.conf.js

#### Examples of configurations: 
You only need to configurate this file in order to work with the website.

Example inside (services.conf.js):
```
module.exports = [
  {
    active: true,
    name: "Ping an address",
    description: "Basic ping",
    type: "ping",
    env: {
      dev: {
        ip: "google.cl"
      }
    },
    timeoutError: 3000
  },
  {
    active: true,
    name: "Echo Test",
    description: "Configure a correct socket connection",
    type: "socket",
    env: {
      dev: {
        ip: "1.0.0.1",
        port: "4900",
        maxTimeoutReceive: 10000,
        handshake: Buffer.from(`Rock it`)
      }
    },
    timeoutError: 3000,
    processOk(response){
      if(!response){
        return false;
      }
      return true;
    }
  },
  {
    active: true,
    name: "Placeholder API",
    description: "Fake API",
    type: "rest",
    env: {
      dev: {
        method: 'get',
        url: "https://jsonplaceholder.typicode.com/posts/1",
        data: {}    
      }
    },
    timeoutError: 6000,
    filter(response){
      return response.data;
    },
    processOk(response){
      if(!response){
        return false;
      }
      return true;
    }
  },
  {
    active: true,
    name: "Webservicex",
    description: "WS Soap from Webservicex.com",
    type: "soap",
    env: {
      dev: {
        wsdl: "http://www.webservicex.net/country.asmx?WSDL",
        operation: 'GetCurrencyByCountry', 
        body: { CountryName: 'Spain' }
      }
    },
    timeoutError: 6000,
    processOk(response){
      if(!response){
        return false;
      }
      return true;
    }
  },
  {
    active: true,
    name: "FTP Tele2",
    description: "Where you can log in as anonymous and upload anything to test",
    type: "ftp",
    env: {
      dev: {
        host: { 
          protocol: "ftp",
          host: "speedtest.tele2.net",
          port: "21",
          user: "anonymous",
          password: "1234567"
        }
      }
    },
    timeoutError: 6000,
    processOk(response){
      if(!response){
        return false;
      }
      return true;
    }
  }

]

```

In the end you will have localhost:8080 for react and localhost:3000 for the general API.

####REACT/REDUX/THUX


![Alt text](reactapp.JPG?raw=true "React app")
####CONFIGURATION FILE API


![Alt text](services.JPG?raw=true "Services")

## Built With

* [WEBPACK](https://webpack.js.org/) - Webpack


## Authors

* **Mauricio Joost Wolff** - *Initial work* - [GitHub](https://github.com/thiswallz)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


