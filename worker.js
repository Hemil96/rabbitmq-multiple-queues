const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) {
    console.log(err);
    return err
  }
  conn.createChannel((err, channel) => {
    if (err) {
      console.log(err);
      return err
    }
    const q = 'task_queue'; // declaring the queue from which we are going to consume

    channel.assertQueue(q, {durable: true});
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

    // Listening to the messages
    channel.consume(q, (msg) => {
      // we will set the setTimeout to number of dots secs 
      const secs = msg.content.toString().split('.').length - 1;
    
      console.log(" [x] Received %s", msg.content.toString());
      // we are using setTimeout to fake the time taken by process
      setTimeout(() => {
        console.log(" [x] Done");
        // sending ack back after getting done
        channel.ack(msg);
      }, secs * 1000);
    }, {noAck: false});
  });
});
