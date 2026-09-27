# SIT314 HD IoT Scalability Architecture

Controller-orchestrated MQTT broker cluster with microservice processing layer.

## Structure
- broker-plugin/ : Mosquitto C plugins for telemetry
- operator/ : Kubernetes Operator in Go
- microservices/ : Go and Python services
- benchmark/ : Custom benchmarking tool
- deploy/ : Helm charts and K8s manifests
- results/ : Experimental data
