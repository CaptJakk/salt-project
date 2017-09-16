const Future = require('fluture');

const getPriceVolume = () => Future.of({ price: 0, volume: 1 });

export default getPriceVolume;
