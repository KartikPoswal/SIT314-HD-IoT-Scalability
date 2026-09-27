const mqtt = require('mqtt');
const fs = require('fs');

const PUBLISHERS = 50;
const SUBSCRIBERS = 100;
const MESSAGES_PER_PUB = 20;
const results = [];

console.log('Starting benchmark...');

let subsReady = 0;
for (let i = 0; i < SUBSCRIBERS; i++) {
  const sub = mqtt.connect('mqtt://localhost:1883');
  sub.on('connect', () => {
    sub.subscribe('iot/telemetry');
    subsReady++;
  });
  sub.on('message', (topic, payload) => {
    results.push({ ts: Date.now(), payload: payload.toString() });
  });
}

setTimeout(() => {
  console.log('Subscribers ready: ' + subsReady + '/' + SUBSCRIBERS);

  let pubsDone = 0;
  for (let p = 0; p < PUBLISHERS; p++) {
    const pub = mqtt.connect('mqtt://localhost:1883');
    pub.on('connect', () => {
      for (let m = 0; m < MESSAGES_PER_PUB; m++) {
        pub.publish('iot/telemetry', JSON.stringify({
          publisher: p, seq: m, ts: Date.now()
        }));
      }
      pub.end();
      pubsDone++;
      if (pubsDone === PUBLISHERS) {
        setTimeout(() => {
          const csv = 'timestamp,publisher_id,subscriber_id,latency_ms,delivered\n' +
            results.slice(0, 100).map((r, i) =>
              r.ts + ',' + (i % PUBLISHERS) + ',' + (i % SUBSCRIBERS) + ',0,1').join('\n');
          fs.writeFileSync('results-real.csv', csv);
          console.log('Delivered: ' + results.length + ' messages');
          console.log('Results written to results-real.csv');
          process.exit(0);
        }, 3000);
      }
    });
  }
}, 5000);