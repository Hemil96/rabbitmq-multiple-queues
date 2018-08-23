const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  console.log('RabbitMQ server connected')
  conn.createChannel((err, channel) => {
    const q = 'task_queue';
    const msg = process.argv.slice(2).join(' ') || "Hello World!";

    channel.assertQueue(q, {durable: true});
    channel.sendToQueue(q, new Buffer(msg), {persistent: true});
    console.log(" [x] Sent '%s'", msg);
  });

  // Closing the connection 
  setTimeout(() => {
    conn.close(); process.exit(0)
  }, 500);
});