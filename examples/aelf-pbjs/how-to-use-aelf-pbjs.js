const AElf = require('../../dist/aelf.cjs.js');

const pbjs = AElf.pbjs;

pbjs.load('./proto/timestamp.proto').then(root => {
  // Obtain a message type
  const HelloMessage = root.lookupType('aelf.Hello');

  const currentTime = new Date().getTime();
  console.log('currentTime', currentTime);
  const payload = {
    current: {
      seconds: Math.floor(currentTime / 1000),
      nanos: currentTime % 1000 * 1000
    }
  };

  const message = HelloMessage.create(payload);
  const buffer = HelloMessage.encode(message).finish();
  console.log('encode message', buffer);

  const messageDecoded = HelloMessage.decode(buffer);
  console.log('decode message', messageDecoded);

  const object = HelloMessage.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
    // see ConversionOptions
  });
  console.log('object', object);
}).catch(error => {
  console.log('error', error);
});
