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
