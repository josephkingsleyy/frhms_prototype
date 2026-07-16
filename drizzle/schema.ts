import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

// ==================== USERS ====================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "doctor", "nurse", "embryologist", "receptionist"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== PATIENTS ====================
export const patients = mysqlTable("patients", {
  id: int("id").autoincrement().primaryKey(),
  patientId: varchar("patientId", { length: 20 }).notNull().unique(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: timestamp("dateOfBirth"),
  gender: mysqlEnum("gender", ["female", "male", "other"]).default("female").notNull(),
  bloodGroup: varchar("bloodGroup", { length: 5 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  emergencyContact: varchar("emergencyContact", { length: 20 }),
  emergencyContactName: varchar("emergencyContactName", { length: 100 }),
  maritalStatus: mysqlEnum("maritalStatus", ["single", "married", "divorced", "widowed"]).default("married"),
  partnerName: varchar("partnerName", { length: 100 }),
  partnerAge: int("partnerAge"),
  yearsOfInfertility: int("yearsOfInfertility"),
  previousTreatments: text("previousTreatments"),
  medicalHistory: text("medicalHistory"),
  allergies: text("allergies"),
  status: mysqlEnum("status", ["active", "inactive", "completed", "transferred"]).default("active").notNull(),
  assignedDoctorId: int("assignedDoctorId"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

// ==================== APPOINTMENTS ====================
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  doctorId: int("doctorId"),
  title: varchar("title", { length: 200 }).notNull(),
  type: mysqlEnum("type", ["consultation", "followup", "procedure", "monitoring", "lab_test", "video_call"]).default("consultation").notNull(),
  date: timestamp("date").notNull(),
  duration: int("duration").default(30),
  status: mysqlEnum("status", ["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"]).default("scheduled").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// ==================== CLINICAL ASSESSMENTS ====================
export const clinicalAssessments = mysqlTable("clinical_assessments", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  doctorId: int("doctorId"),
  assessmentType: mysqlEnum("assessmentType", ["initial", "hormonal", "ultrasound", "semen_analysis", "hysteroscopy", "laparoscopy", "genetic"]).notNull(),
  assessmentDate: timestamp("assessmentDate").notNull(),
  findings: text("findings"),
  diagnosis: text("diagnosis"),
  recommendations: text("recommendations"),
  amh: decimal("amh", { precision: 5, scale: 2 }),
  fsh: decimal("fsh", { precision: 5, scale: 2 }),
  lh: decimal("lh", { precision: 5, scale: 2 }),
  estradiol: decimal("estradiol", { precision: 7, scale: 2 }),
  progesterone: decimal("progesterone", { precision: 5, scale: 2 }),
  tsh: decimal("tsh", { precision: 5, scale: 2 }),
  prolactin: decimal("prolactin", { precision: 6, scale: 2 }),
  antralFollicleCount: int("antralFollicleCount"),
  endometrialThickness: decimal("endometrialThickness", { precision: 4, scale: 1 }),
  status: mysqlEnum("status", ["pending", "completed", "reviewed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClinicalAssessment = typeof clinicalAssessments.$inferSelect;
export type InsertClinicalAssessment = typeof clinicalAssessments.$inferInsert;

// ==================== IVF CYCLES ====================
export const ivfCycles = mysqlTable("ivf_cycles", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  doctorId: int("doctorId"),
  cycleNumber: int("cycleNumber").default(1).notNull(),
  cycleType: mysqlEnum("cycleType", ["ivf", "icsi", "iui", "fet", "egg_freezing", "donor_egg", "surrogacy"]).notNull(),
  protocol: varchar("protocol", { length: 100 }),
  startDate: timestamp("startDate"),
  stimulationStartDate: timestamp("stimulationStartDate"),
  triggerDate: timestamp("triggerDate"),
  retrievalDate: timestamp("retrievalDate"),
  transferDate: timestamp("transferDate"),
  betaHcgDate: timestamp("betaHcgDate"),
  endDate: timestamp("endDate"),
  status: mysqlEnum("status", ["planned", "stimulation", "trigger", "retrieval", "fertilization", "culture", "transfer", "tww", "pregnant", "not_pregnant", "cancelled", "completed"]).default("planned").notNull(),
  eggsRetrieved: int("eggsRetrieved"),
  eggsMature: int("eggsMature"),
  eggsFertilized: int("eggsFertilized"),
  embryosFormed: int("embryosFormed"),
  embryosTransferred: int("embryosTransferred"),
  embryosFrozen: int("embryosFrozen"),
  outcome: mysqlEnum("outcome", ["positive", "negative", "chemical", "ectopic", "miscarriage", "ongoing", "pending"]),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IvfCycle = typeof ivfCycles.$inferSelect;
export type InsertIvfCycle = typeof ivfCycles.$inferInsert;

// ==================== CYCLE MONITORING ====================
export const cycleMonitorings = mysqlTable("cycle_monitorings", {
  id: int("id").autoincrement().primaryKey(),
  cycleId: int("cycleId").notNull(),
  patientId: int("patientId").notNull(),
  monitoringDate: timestamp("monitoringDate").notNull(),
  dayOfCycle: int("dayOfCycle"),
  estradiol: decimal("estradiol", { precision: 7, scale: 2 }),
  lh: decimal("lh", { precision: 5, scale: 2 }),
  progesterone: decimal("progesterone", { precision: 5, scale: 2 }),
  endometrialThickness: decimal("endometrialThickness", { precision: 4, scale: 1 }),
  follicleCountLeft: int("follicleCountLeft"),
  follicleCountRight: int("follicleCountRight"),
  follicleSizesLeft: text("follicleSizesLeft"),
  follicleSizesRight: text("follicleSizesRight"),
  medicationAdjustment: text("medicationAdjustment"),
  nextVisitDate: timestamp("nextVisitDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CycleMonitoring = typeof cycleMonitorings.$inferSelect;
export type InsertCycleMonitoring = typeof cycleMonitorings.$inferInsert;

// ==================== EMBRYOLOGY RECORDS ====================
export const embryologyRecords = mysqlTable("embryology_records", {
  id: int("id").autoincrement().primaryKey(),
  cycleId: int("cycleId").notNull(),
  patientId: int("patientId").notNull(),
  embryoNumber: int("embryoNumber").notNull(),
  fertilizationMethod: mysqlEnum("fertilizationMethod", ["ivf", "icsi", "split"]),
  fertilizationDate: timestamp("fertilizationDate"),
  day1Score: varchar("day1Score", { length: 20 }),
  day2Score: varchar("day2Score", { length: 20 }),
  day3Score: varchar("day3Score", { length: 20 }),
  day4Score: varchar("day4Score", { length: 20 }),
  day5Score: varchar("day5Score", { length: 20 }),
  day6Score: varchar("day6Score", { length: 20 }),
  blastocystGrade: varchar("blastocystGrade", { length: 20 }),
  pgtResult: mysqlEnum("pgtResult", ["normal", "abnormal", "mosaic", "no_result", "pending"]),
  status: mysqlEnum("status", ["developing", "arrested", "transferred", "frozen", "discarded", "biopsied"]).default("developing").notNull(),
  freezeDate: timestamp("freezeDate"),
  thawDate: timestamp("thawDate"),
  transferDate: timestamp("transferDate"),
  storageLocation: varchar("storageLocation", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmbryologyRecord = typeof embryologyRecords.$inferSelect;
export type InsertEmbryologyRecord = typeof embryologyRecords.$inferInsert;

// ==================== LAB RESULTS ====================
export const labResults = mysqlTable("lab_results", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  orderedBy: int("orderedBy"),
  testName: varchar("testName", { length: 200 }).notNull(),
  testCategory: mysqlEnum("testCategory", ["hormonal", "blood", "genetic", "semen", "imaging", "other"]).default("other").notNull(),
  testDate: timestamp("testDate").notNull(),
  resultValue: varchar("resultValue", { length: 100 }),
  unit: varchar("unit", { length: 50 }),
  referenceRange: varchar("referenceRange", { length: 100 }),
  status: mysqlEnum("status", ["ordered", "sample_collected", "processing", "completed", "reviewed"]).default("ordered").notNull(),
  isAbnormal: boolean("isAbnormal").default(false),
  notes: text("notes"),
  attachmentUrl: text("attachmentUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LabResult = typeof labResults.$inferSelect;
export type InsertLabResult = typeof labResults.$inferInsert;

// ==================== MEDICATIONS ====================
export const medications = mysqlTable("medications", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  prescribedBy: int("prescribedBy"),
  cycleId: int("cycleId"),
  name: varchar("name", { length: 200 }).notNull(),
  genericName: varchar("genericName", { length: 200 }),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  frequency: varchar("frequency", { length: 100 }),
  route: mysqlEnum("route", ["oral", "injection_sc", "injection_im", "vaginal", "topical", "nasal"]).default("oral"),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  status: mysqlEnum("status", ["active", "completed", "discontinued", "on_hold"]).default("active").notNull(),
  purpose: text("purpose"),
  sideEffects: text("sideEffects"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = typeof medications.$inferInsert;

// ==================== BILLING TRANSACTIONS ====================
export const billingTransactions = mysqlTable("billing_transactions", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  transactionId: varchar("transactionId", { length: 30 }).notNull().unique(),
  service: varchar("service", { length: 300 }).notNull(),
  category: mysqlEnum("category", ["consultation", "procedure", "medication", "lab_test", "package", "qna", "other"]).default("other").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "card", "upi", "net_banking", "wallet", "insurance"]),
  status: mysqlEnum("status", ["pending", "paid", "overdue", "refunded", "cancelled"]).default("pending").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 30 }),
  paidAt: timestamp("paidAt"),
  dueDate: timestamp("dueDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BillingTransaction = typeof billingTransactions.$inferSelect;
export type InsertBillingTransaction = typeof billingTransactions.$inferInsert;

// ==================== KNOWLEDGE HUB CONTENT ====================
export const knowledgeContent = mysqlTable("knowledge_content", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  contentType: mysqlEnum("contentType", ["article", "video", "infographic", "faq", "guide"]).default("article").notNull(),
  category: varchar("category", { length: 100 }),
  summary: text("summary"),
  content: text("content"),
  videoUrl: text("videoUrl"),
  thumbnailUrl: text("thumbnailUrl"),
  authorId: int("authorId"),
  isPublished: boolean("isPublished").default(false),
  isFeatured: boolean("isFeatured").default(false),
  viewCount: int("viewCount").default(0),
  tags: text("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnowledgeContent = typeof knowledgeContent.$inferSelect;
export type InsertKnowledgeContent = typeof knowledgeContent.$inferInsert;

// ==================== QNA SESSIONS ====================
export const qnaSessions = mysqlTable("qna_sessions", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  specialistId: int("specialistId"),
  question: text("question").notNull(),
  answer: text("answer"),
  attachmentUrl: text("attachmentUrl"),
  category: varchar("category", { length: 100 }),
  status: mysqlEnum("status", ["pending", "assigned", "answered", "closed"]).default("pending").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded"]).default("pending"),
  answeredAt: timestamp("answeredAt"),
  rating: int("rating"),
  feedback: text("feedback"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QnaSession = typeof qnaSessions.$inferSelect;
export type InsertQnaSession = typeof qnaSessions.$inferInsert;