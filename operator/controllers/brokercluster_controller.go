package controllers

import (
    "context"
    "math"
    "time"

    appsv1 "k8s.io/api/apps/v1"
    "k8s.io/apimachinery/pkg/types"
    ctrl "sigs.k8s.io/controller-runtime"
    "sigs.k8s.io/controller-runtime/pkg/client"

    iotv1 "github.com/example/iot-operator/api/v1"
)

type BrokerClusterReconciler struct {
    client.Client
}

func (r *BrokerClusterReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    var cluster iotv1.BrokerCluster
    if err := r.Get(ctx, req.NamespacedName, &cluster); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }

    connCount := getRedisMetric("broker:connections:current")
    desiredReplicas := int32(math.Ceil(float64(connCount) / 500.0))
    if desiredReplicas < 2 { desiredReplicas = 2 }
    if desiredReplicas > 16 { desiredReplicas = 16 }

    var deployment appsv1.Deployment
    r.Get(ctx, types.NamespacedName{Name: "broker-frontend", Namespace: cluster.Namespace}, &deployment)
    deployment.Spec.Replicas = &desiredReplicas
    r.Update(ctx, &deployment)

    return ctrl.Result{RequeueAfter: 10 * time.Second}, nil
}

func getRedisMetric(key string) int {
    return 4120 // placeholder
}
