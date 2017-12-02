var OscEmitter = require('osc-emitter'),
    emitter = new OscEmitter();
emitter.add('localhost', 6448);
emitter.emit('/foo', 1, 2, 3);