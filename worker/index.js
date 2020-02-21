const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

// slow recursive solution to fibinacci sequence
function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

// any time we get a new value in redis, calculate a new fib value and insert into a hash called values
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)))
});
// watch for insert event on redis
sub.subscribe('insert');

