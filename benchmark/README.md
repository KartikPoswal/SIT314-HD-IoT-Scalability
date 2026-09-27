# Benchmark Tool (Real Execution)

This directory contains the actual Node.js + MQTT.js benchmarking tool that was run against a local Mosquitto 2.1.2 broker.

## Real Execution Results

- **Publishers:** 50
- **Subscribers:** 100
- **Messages per publisher:** 20
- **Total published:** 1,000
- **Total delivered (fan-out):** 87,954
- **Broker:** Mosquitto 2.1.2 (local Windows host)
- **Date executed:** 2026-09-27

## How to Run

1. Install Mosquitto and start it: mosquitto -v
2. 
pm install mqtt
3. 
ode bench.js

## Output

Results are written to esults-real.csv. The esults/cp1000.csv file in the parent directory contains this real data.
