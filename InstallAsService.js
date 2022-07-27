var Service = require('node-windows').Service;
// Create a new service object
var svc = new Service({
     name:'Trace',
     description: 'Trace Discord Bot.',
     script: 'D:\\discord\\Trace\\src\\main.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.

svc.on('install',function(){
           svc.start();
});

svc.uninstall();