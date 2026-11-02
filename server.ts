import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import { db } from "./src/db/index.ts";
import { telemetry, incidents, auditLogs } from "./src/db/schema.ts";
import { eq, desc } from "drizzle-orm";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Ingestion API (Simulating FastAPI)
  app.post("/api/telemetry", async (req, res) => {
    try {
      const data = req.body;
      const inserted = await db.insert(telemetry).values(data).returning();
      
      // Emit to connected clients
      io.emit("telemetry_update", inserted[0]);
      
      // Simulate Anomaly Detection
      if (inserted[0].anomalyScorePercent && inserted[0].anomalyScorePercent > 80) {
        const incidentId = `INC-${Date.now()}`;
        const incident = await db.insert(incidents).values({
          id: incidentId,
          title: `High Anomaly Score on ${inserted[0].deviceId}`,
          status: 'ACTIVE',
          severity: inserted[0].anomalyScorePercent > 90 ? 'CRITICAL' : 'HIGH',
          targetDeviceName: inserted[0].deviceId,
          anomalyScore: Math.round(Number(inserted[0].anomalyScorePercent || 0)),
          aiConfidence: Math.floor(Math.random() * 20) + 80,
          cpuTempDeviation: inserted[0].avgCpuTempC ? inserted[0].avgCpuTempC - 60 : 0,
        }).returning();
        io.emit("incident_alert", incident[0]);
        
        await db.insert(auditLogs).values({
          id: `LOG-${Date.now()}`,
          event: `Anomaly Alert Generated: ${incidentId}`,
          device: inserted[0].deviceId,
          severity: 'HIGH',
          source: 'AI_ENGINE',
          status: 'COMPLETED'
        });
      }
      
      res.json({ status: "success", data: inserted[0] });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  app.get("/api/telemetry/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const history = await db.select().from(telemetry).orderBy(desc(telemetry.timestamp)).limit(limit);
      res.json(history.reverse());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/incidents", async (req, res) => {
    try {
      const allIncidents = await db.select().from(incidents).orderBy(desc(incidents.detectedAt));
      res.json(allIncidents);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get("/api/export/csv", async (req, res) => {
    try {
      const type = req.query.type as string;
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="helios_export_${type}_${Date.now()}.csv"`);
      
      if (type === "telemetry") {
        const data = await db.select().from(telemetry).orderBy(desc(telemetry.timestamp)).limit(500);
        let csv = "Timestamp,DeviceID,PowerMW,SolarMW,CpuTemp,AnomalyScore\n";
        data.forEach(d => {
          csv += `${d.timestamp},${d.deviceId},${d.totalPowerMw},${d.solarGenerationMw},${d.avgCpuTempC},${d.anomalyScorePercent}\n`;
        });
        return res.send(csv);
      } else if (type === "incidents") {
        const data = await db.select().from(incidents).orderBy(desc(incidents.detectedAt));
        let csv = "ID,Title,Severity,Status,Device,DetectedAt\n";
        data.forEach(d => {
          csv += `${d.id},${d.title},${d.severity},${d.status},${d.targetDeviceName},${d.detectedAt}\n`;
        });
        return res.send(csv);
      } else {
        return res.status(400).send("Invalid type");
      }
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  });

  app.get("/api/status", (req, res) => {
    res.json({ status: "online", timestamp: new Date().toISOString() });
  });

  // Simulator loop to generate data if no physical devices are connected
  setInterval(async () => {
    try {
      const deviceId = "HELIOS-CORE-01";
      const totalPowerMw = 450 + Math.random() * 50;
      const anomalyScorePercent = Math.random() * 100 > 95 ? 85 + Math.random() * 15 : Math.random() * 20;
      
      const payload = {
        deviceId,
        totalPowerMw,
        solarGenerationMw: 120 + Math.random() * 30,
        voltageV: 400 + Math.random() * 20,
        currentA: totalPowerMw / 400 * 1000,
        avgCpuTempC: 45 + Math.random() * 25,
        networkLatencyMs: 12 + Math.random() * 8,
        anomalyScorePercent
      };
      
      const inserted = await db.insert(telemetry).values(payload).returning();
      io.emit("telemetry_update", inserted[0]);
      
      if (inserted[0].anomalyScorePercent && inserted[0].anomalyScorePercent > 80) {
        const incidentId = `INC-${Date.now()}`;
        const incident = await db.insert(incidents).values({
          id: incidentId,
          title: `Simulated Anomaly on ${inserted[0].deviceId}`,
          status: 'ACTIVE',
          severity: inserted[0].anomalyScorePercent > 90 ? 'CRITICAL' : 'HIGH',
          targetDeviceName: inserted[0].deviceId,
          anomalyScore: Math.round(Number(inserted[0].anomalyScorePercent || 0)),
          aiConfidence: Math.floor(Math.random() * 20) + 80,
          cpuTempDeviation: inserted[0].avgCpuTempC ? inserted[0].avgCpuTempC - 45 : 0,
        }).returning();
        io.emit("incident_alert", incident[0]);
      }
    } catch (err) {
      console.error("Simulation error:", err);
    }
  }, 2000);

  // WebSockets Connection
  io.on("connection", (socket) => {
    console.log("Client connected via WebSocket", socket.id);
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
