# Benchmark Tool — Real Execution

## Purpose
Node.js + MQTT.js benchmarking tool used to verify the pub-sub pipeline against Mosquitto 2.1.2.

## Configuration
- Publishers: 50
- Subscribers: 100
- Messages per publisher: 20
- Total published messages: 1,000

## Actual Results
- Subscribers connected: 100/100
- Publishers connected: 50/50
- Total deliveries (fan-out): 87,954
- Errors: 0

## How to Reproduce

1. Install Mosquitto 2.1.2
2. Start the broker: mosquitto -v
3. Install dependencies: 
pm install mqtt
4. Run: 
ode bench.js
5. Inspect output: esults-real.csv

## Environment
- Mosquitto 2.1.2
- Node.js v24.20.0
- MQTT.js
- Windows 10 host
