import { WS } from 'Services';

/* This action does not modify state directlly.
 * The payload will be the callback that get's called for each tick
 */
let cb;
const ticksCallback = (response) => {
    const data = response.error ? response.error.message : `${new Date(response.tick.epoch * 1000).toUTCString()}: ${response.tick.quote}`;
    cb(data);
};

export const getTicks = function({ symbol }, callback) {
    cb = callback;
    WS.subscribeTicks(symbol, ticksCallback, true);
    return { };
};
