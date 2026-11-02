import { pgTable, serial, text, timestamp, integer, real, boolean } from 'drizzle-orm/pg-core';

export const telemetry = pgTable('telemetry', {
  id: serial('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  totalPowerMw: real('total_power_mw'),
  solarGenerationMw: real('solar_generation_mw'),
  voltageV: real('voltage_v'),
  currentA: real('current_a'),
  avgCpuTempC: real('avg_cpu_temp_c'),
  networkLatencyMs: real('network_latency_ms'),
  anomalyScorePercent: real('anomaly_score_percent'),
});

export const incidents = pgTable('incidents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  status: text('status').notNull(), // ACTIVE, INVESTIGATING, RESOLVED
  severity: text('severity').notNull(), // CRITICAL, HIGH, MEDIUM
  targetDeviceName: text('target_device_name').notNull(),
  anomalyScore: integer('anomaly_score').notNull(),
  aiConfidence: integer('ai_confidence').notNull(),
  detectedAt: timestamp('detected_at', { withTimezone: true }).defaultNow().notNull(),
  cpuTempDeviation: real('cpu_temp_deviation'),
  ramDeviation: real('ram_deviation'),
  voltageDeviation: real('voltage_deviation'),
  latencyDeviation: real('latency_deviation'),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  event: text('event').notNull(),
  device: text('device').notNull(),
  severity: text('severity').notNull(), // HIGH, MEDIUM, INFO
  source: text('source').notNull(), // SYSTEM, AI_ENGINE, OPERATOR
  status: text('status').notNull(), // COMPLETED, FAILED
});
