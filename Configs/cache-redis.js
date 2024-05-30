require("dotenv").config()
const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const client = redis.createClient({
    url: `redis://${process.env.RedisHost}:6379`,
    retry_strategy: () => 1000
});
(async () => {
    try {
        await client.connect();
        await client.ping();
        console.log("Connected to Redis");

        // Perform a basic test to confirm connection
        await client.set('test', 'Redis connection successful');
        const value = await client.get('test');
        console.log("Test value from Redis:", value);  // Should log: "Test value from Redis: Redis connection successful"

    } catch (err) {
        console.error("Could not connect to Redis", err);
    }
})();


const exec = mongoose.Query.prototype.exec;


mongoose.Query.prototype.cache = function(options= {time: 60}) {
    this.useCache = true;
    this.time = options.time;
    this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);

    return this;
}

mongoose.Query.prototype.exec = async function () {

    if(!this.useCache) {
        return await exec.apply(this,arguments)
    }
    const key = JSON.stringify({
        ...this.getQuery()
    })

const cacheValue = await client.hGet(this.hashKey , key)

if(cacheValue) {
    const doc = JSON.parse(cacheValue)

    console.log("Reponse from Redis")
    return Array.isArray(doc)
    ?doc.map(d => new this.model(d))
    :new this.model
}
const results = await exec.apply(this,arguments)
console.log(this.time);
client.hSet(this.hashKey , key , JSON.stringify(results));
client.expire(this.hashKey , this.time);

console.log("response from MongoDB")
return results
}

module.exports = {
    clearKey(hashKey){
        client.del(JSON.stringify(hashKey))
    },
};
