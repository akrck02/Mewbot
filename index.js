//require('dotenv').config();
console.log(process.env['token']);

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: process.env['token'] });
manager.on('shardCreate', shard => console.log(`[Shard Manager] Launched shard ${shard.id}`));
manager.spawn({ amount: 1, delay: 5500, timeout: 300000 });