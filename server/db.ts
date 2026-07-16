import { eq, desc, sql, and, gte, lte, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, patients, appointments, clinicalAssessments, ivfCycles, cycleMonitorings, embryologyRecords, labResults, medications, billingTransactions, knowledgeContent, qnaSessions, type InsertPatient, type InsertAppointment, type InsertClinicalAssessment, type InsertIvfCycle, type InsertCycleMonitoring, type InsertEmbryologyRecord, type InsertLabResult, type InsertMedication, type InsertBillingTransaction, type InsertKnowledgeContent, type InsertQnaSession } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== PATIENT QUERIES ====================
export async function getPatients(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(patients).orderBy(desc(patients.createdAt)).limit(limit).offset(offset);
}

export async function getPatientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
  return result[0];
}

export async function createPatient(data: InsertPatient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(patients).values(data);
  return result[0].insertId;
}

export async function updatePatient(id: number, data: Partial<InsertPatient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(patients).set(data).where(eq(patients.id, id));
}

export async function deletePatient(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(patients).where(eq(patients.id, id));
}

export async function getPatientCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(patients);
  return result[0]?.count ?? 0;
}

// ==================== APPOINTMENT QUERIES ====================
export async function getAppointments(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(appointments).orderBy(desc(appointments.date)).limit(limit).offset(offset);
}

export async function getAppointmentsByPatient(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(appointments).where(eq(appointments.patientId, patientId)).orderBy(desc(appointments.date));
}

export async function createAppointment(data: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(appointments).values(data);
  return result[0].insertId;
}

export async function updateAppointment(id: number, data: Partial<InsertAppointment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(appointments).set(data).where(eq(appointments.id, id));
}

// ==================== CLINICAL ASSESSMENT QUERIES ====================
export async function getAllClinicalAssessments(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clinicalAssessments).orderBy(desc(clinicalAssessments.assessmentDate)).limit(limit).offset(offset);
}

export async function getClinicalAssessments(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clinicalAssessments).where(eq(clinicalAssessments.patientId, patientId)).orderBy(desc(clinicalAssessments.assessmentDate));
}

export async function createClinicalAssessment(data: InsertClinicalAssessment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(clinicalAssessments).values(data);
  return result[0].insertId;
}

// ==================== IVF CYCLE QUERIES ====================
export async function getIvfCycles(patientId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (patientId) {
    return db.select().from(ivfCycles).where(eq(ivfCycles.patientId, patientId)).orderBy(desc(ivfCycles.startDate));
  }
  return db.select().from(ivfCycles).orderBy(desc(ivfCycles.startDate)).limit(50);
}

export async function createIvfCycle(data: InsertIvfCycle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(ivfCycles).values(data);
  return result[0].insertId;
}

export async function updateIvfCycle(id: number, data: Partial<InsertIvfCycle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(ivfCycles).set(data).where(eq(ivfCycles.id, id));
}

// ==================== CYCLE MONITORING QUERIES ====================
export async function getCycleMonitorings(cycleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cycleMonitorings).where(eq(cycleMonitorings.cycleId, cycleId)).orderBy(desc(cycleMonitorings.monitoringDate));
}

export async function createCycleMonitoring(data: InsertCycleMonitoring) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cycleMonitorings).values(data);
  return result[0].insertId;
}

// ==================== EMBRYOLOGY QUERIES ====================
export async function getEmbryologyRecords(cycleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(embryologyRecords).where(eq(embryologyRecords.cycleId, cycleId)).orderBy(embryologyRecords.embryoNumber);
}

export async function createEmbryologyRecord(data: InsertEmbryologyRecord) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(embryologyRecords).values(data);
  return result[0].insertId;
}

export async function updateEmbryologyRecord(id: number, data: Partial<InsertEmbryologyRecord>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(embryologyRecords).set(data).where(eq(embryologyRecords.id, id));
}

// ==================== LAB RESULTS QUERIES ====================
export async function getLabResults(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(labResults).where(eq(labResults.patientId, patientId)).orderBy(desc(labResults.testDate));
}

export async function createLabResult(data: InsertLabResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(labResults).values(data);
  return result[0].insertId;
}

export async function updateLabResult(id: number, data: Partial<InsertLabResult>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(labResults).set(data).where(eq(labResults.id, id));
}

// ==================== MEDICATION QUERIES ====================
export async function getMedications(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(medications).where(eq(medications.patientId, patientId)).orderBy(desc(medications.startDate));
}

export async function createMedication(data: InsertMedication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(medications).values(data);
  return result[0].insertId;
}

export async function updateMedication(id: number, data: Partial<InsertMedication>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(medications).set(data).where(eq(medications.id, id));
}

// ==================== BILLING QUERIES ====================
export async function getBillingTransactions(patientId?: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  if (patientId) {
    return db.select().from(billingTransactions).where(eq(billingTransactions.patientId, patientId)).orderBy(desc(billingTransactions.createdAt)).limit(limit);
  }
  return db.select().from(billingTransactions).orderBy(desc(billingTransactions.createdAt)).limit(limit);
}

export async function createBillingTransaction(data: InsertBillingTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(billingTransactions).values(data);
  return result[0].insertId;
}

// ==================== KNOWLEDGE HUB QUERIES ====================
export async function getKnowledgeContent(published = true) {
  const db = await getDb();
  if (!db) return [];
  if (published) {
    return db.select().from(knowledgeContent).where(eq(knowledgeContent.isPublished, true)).orderBy(desc(knowledgeContent.createdAt));
  }
  return db.select().from(knowledgeContent).orderBy(desc(knowledgeContent.createdAt));
}

export async function createKnowledgeContent(data: InsertKnowledgeContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(knowledgeContent).values(data);
  return result[0].insertId;
}

// ==================== QNA QUERIES ====================
export async function getQnaSessions(patientId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (patientId) {
    return db.select().from(qnaSessions).where(eq(qnaSessions.patientId, patientId)).orderBy(desc(qnaSessions.createdAt));
  }
  return db.select().from(qnaSessions).orderBy(desc(qnaSessions.createdAt)).limit(50);
}

export async function createQnaSession(data: InsertQnaSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(qnaSessions).values(data);
  return result[0].insertId;
}

export async function updateQnaSession(id: number, data: Partial<InsertQnaSession>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(qnaSessions).set(data).where(eq(qnaSessions.id, id));
}

// ==================== DASHBOARD ANALYTICS ====================
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalPatients: 0, activePatients: 0, totalAppointments: 0, activeCycles: 0, totalRevenue: "0" };
  
  const [patientCount] = await db.select({ count: count() }).from(patients);
  const [activePatientCount] = await db.select({ count: count() }).from(patients).where(eq(patients.status, "active"));
  const [appointmentCount] = await db.select({ count: count() }).from(appointments);
  const [activeCycleCount] = await db.select({ count: count() }).from(ivfCycles).where(
    and(
      eq(ivfCycles.status, "stimulation"),
    )
  );
  const [revenue] = await db.select({ total: sql<string>`COALESCE(SUM(totalAmount), 0)` }).from(billingTransactions).where(eq(billingTransactions.status, "paid"));

  return {
    totalPatients: patientCount?.count ?? 0,
    activePatients: activePatientCount?.count ?? 0,
    totalAppointments: appointmentCount?.count ?? 0,
    activeCycles: activeCycleCount?.count ?? 0,
    totalRevenue: revenue?.total ?? "0",
  };
}
