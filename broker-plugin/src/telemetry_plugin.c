#include <mosquitto.h>
#include <mosquitto_broker.h>
#include <mosquitto_plugin.h>
#include <hiredis/hiredis.h>

static redisContext *redis_ctx;

int mosquitto_plugin_init(mosquitto_plugin_id_t *identifier,
                          void **userdata,
                          struct mosquitto_opt *opts,
                          int opt_count) {
    redis_ctx = redisConnect("redis-state.default.svc.cluster.local", 6379);
    if (redis_ctx == NULL || redis_ctx->err) return MOSQ_ERR_UNKNOWN;
    mosquitto_callback_register(identifier, MOSQ_EVT_CONNECT, on_connect, NULL, NULL);
    mosquitto_callback_register(identifier, MOSQ_EVT_PUBLISH, on_publish, NULL, NULL);
    return MOSQ_ERR_SUCCESS;
}

int on_connect(int event, void *event_data, void *userdata) {
    struct mosquitto_evt_connect *evt = event_data;
    redisCommand(redis_ctx, "XADD broker:telemetry * event connect client_id %s", evt->client_id);
    return MOSQ_ERR_SUCCESS;
}

int on_publish(int event, void *event_data, void *userdata) {
    struct mosquitto_evt_publish *evt = event_data;
    redisCommand(redis_ctx, "XADD broker:telemetry * event publish topic %s payloadlen %d",
                 evt->topic, evt->payloadlen);
    return MOSQ_ERR_SUCCESS;
}
