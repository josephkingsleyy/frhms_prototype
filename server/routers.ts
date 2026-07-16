import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==================== DASHBOARD ====================
  dashboard: router({
    stats: protectedProcedure.query(async () => {
      return db.getDashboardStats();
    }),
  }),

  // ==================== PATIENTS ====================
  patients: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getPatients(input?.limit ?? 50, input?.offset ?? 0);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPatientById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        patientId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        dateOfBirth: z.date().optional(),
        gender: z.enum(["female", "male", "other"]).default("female"),
        bloodGroup: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        emergencyContact: z.string().optional(),
        emergencyContactName: z.string().optional(),
        maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
        partnerName: z.string().optional(),
        partnerAge: z.number().optional(),
        yearsOfInfertility: z.number().optional(),
        previousTreatments: z.string().optional(),
        medicalHistory: z.string().optional(),
        allergies: z.string().optional(),
        assignedDoctorId: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createPatient(input);
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          status: z.enum(["active", "inactive", "completed", "transferred"]).optional(),
          notes: z.string().optional(),
          assignedDoctorId: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updatePatient(input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePatient(input.id);
        return { success: true };
      }),
    count: protectedProcedure.query(async () => {
      return db.getPatientCount();
    }),
  }),

  // ==================== APPOINTMENTS ====================
  appointments: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getAppointments(input?.limit ?? 50, input?.offset ?? 0);
      }),
    byPatient: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ input }) => {
        return db.getAppointmentsByPatient(input.patientId);
      }),
    create: protectedProcedure
      .input(z.object({
        patientId: z.number(),
        doctorId: z.number().optional(),
        title: z.string(),
        type: z.enum(["consultation", "followup", "procedure", "monitoring", "lab_test", "video_call"]).default("consultation"),
        date: z.date(),
        duration: z.number().default(30),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createAppointment(input);
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          status: z.enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"]).optional(),
          notes: z.string().optional(),
          date: z.date().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateAppointment(input.id, input.data);
        return { success: true };
      }),
  }),

  // ==================== CLINICAL ASSESSMENTS ====================
  clinicalAssessments: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getAllClinicalAssessments(input?.limit ?? 50, input?.offset ?? 0);
      }),
    byPatient: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ input }) => {
        return db.getClinicalAssessments(input.patientId);
      }),
    create: protectedProcedure
      .input(z.object({
        patientId: z.number(),
        doctorId: z.number().optional(),
        assessmentType: z.enum(["initial", "hormonal", "ultrasound", "semen_analysis", "hysteroscopy", "laparoscopy", "genetic"]),
        assessmentDate: z.date(),
        findings: z.string().optional(),
        diagnosis: z.string().optional(),
        recommendations: z.string().optional(),
        amh: z.string().optional(),
        fsh: z.string().optional(),
        lh: z.string().optional(),
        estradiol: z.string().optional(),
        progesterone: z.string().optional(),
        tsh: z.string().optional(),
        prolactin: z.string().optional(),
        antralFollicleCount: z.number().optional(),
        endometrialThickness: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createClinicalAssessment(input);
        return { id };
      }),
  }),

  // ==================== IVF CYCLES ====================
  ivfCycles: router({
    list: protectedProcedure
      .input(z.object({ patientId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getIvfCycles(input?.patientId);
      }),
    create: protectedProcedure
      .input(z.object({
        patientId: z.number(),
        doctorId: z.number().optional(),
        cycleNumber: z.number().default(1),
        cycleType: z.enum(["ivf", "icsi", "iui", "fet", "egg_freezing", "donor_egg", "surrogacy"]),
        protocol: z.string().optional(),
        startDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createIvfCycle(input);
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          status: z.enum(["planned", "stimulation", "trigger", "retrieval", "fertilization", "culture", "transfer", "tww", "pregnant", "not_pregnant", "cancelled", "completed"]).optional(),
          eggsRetrieved: z.number().optional(),
          eggsMature: z.number().optional(),
          eggsFertilized: z.number().optional(),
          embryosFormed: z.number().optional(),
          embryosTransferred: z.number().optional(),
          embryosFrozen: z.number().optional(),
          outcome: z.enum(["positive", "negative", "chemical", "ectopic", "miscarriage", "ongoing", "pending"]).optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateIvfCycle(input.id, input.data);
        return { success: true };
      }),
  }),

  // ==================== CYCLE MONITORING ====================
  cycleMonitoring: router({
    byCycle: protectedProcedure
      .input(z.object({ cycleId: z.number() }))
      .query(async ({ input }) => {
        return db.getCycleMonitorings(input.cycleId);
      }),
    create: protectedProcedure
      .input(z.object({
        cycleId: z.number(),
        patientId: z.number(),
        monitoringDate: z.date(),
        dayOfCycle: z.number().optional(),
        estradiol: z.string().optional(),
        lh: z.string().optional(),
        progesterone: z.string().optional(),
        endometrialThickness: z.string().optional(),
        follicleCountLeft: z.number().optional(),
        follicleCountRight: z.number().optional(),
        follicleSizesLeft: z.string().optional(),
        follicleSizesRight: z.string().optional(),
        medicationAdjustment: z.string().optional(),
        nextVisitDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createCycleMonitoring(input);
        return { id };
      }),
  }),

  // ==================== EMBRYOLOGY ====================
  embryology: router({
    byCycle: protectedProcedure
      .input(z.object({ cycleId: z.number() }))
      .query(async ({ input }) => {
        return db.getEmbryologyRecords(input.cycleId);
      }),
    create: protectedProcedure
      .input(z.object({
        cycleId: z.number(),
        patientId: z.number(),
        embryoNumber: z.number(),
        fertilizationMethod: z.enum(["ivf", "icsi", "split"]).optional(),
        fertilizationDate: z.date().optional(),
        status: z.enum(["developing", "arrested", "transferred", "frozen", "discarded", "biopsied"]).default("developing"),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createEmbryologyRecord(input);
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          day1Score: z.string().optional(),
          day2Score: z.string().optional(),
          day3Score: z.string().optional(),
          day4Score: z.string().optional(),
          day5Score: z.string().optional(),
          day6Score: z.string().optional(),
          blastocystGrade: z.string().optional(),
          pgtResult: z.enum(["normal", "abnormal", "mosaic", "no_result", "pending"]).optional(),
          status: z.enum(["developing", "arrested", "transferred", "frozen", "discarded", "biopsied"]).optional(),
          storageLocation: z.string().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateEmbryologyRecord(input.id, input.data);
        return { success: true };
      }),
  }),

  // ==================== LAB RESULTS ====================
  labResults: router({
    byPatient: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ input }) => {
        return db.getLabResults(input.patientId);
      }),
    create: protectedProcedure
      .input(z.object({
        patientId: z.number(),
        orderedBy: z.number().optional(),
        testName: z.string(),
        testCategory: z.enum(["hormonal", "blood", "genetic", "semen", "imaging", "other"]).default("other"),
        testDate: z.date(),
        resultValue: z.string().optional(),
        unit: z.string().optional(),
        referenceRange: z.string().optional(),
        isAbnormal: z.boolean().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createLabResult(input);
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          resultValue: z.string().optional(),
          status: z.enum(["ordered", "sample_collected", "processing", "completed", "reviewed"]).optional(),
          isAbnormal: z.boolean().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateLabResult(input.id, input.data);
        return { success: true };
      }),
  }),

  // ==================== MEDICATIONS ====================
  medications: router({
    byPatient: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ input }) => {
        return db.getMedications(input.patientId);
      }),
    create: protectedProcedure
      .input(z.object({
        patientId: z.number(),
        prescribedBy: z.number().optional(),
        cycleId: z.number().optional(),
        name: z.string(),
        genericName: z.string().optional(),
        dosage: z.string(),
        frequency: z.string().optional(),
        route: z.enum(["oral", "injection_sc", "injection_im", "vaginal", "topical", "nasal"]).default("oral"),
        startDate: z.date(),
        endDate: z.date().optional(),
        purpose: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createMedication(input);
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          status: z.enum(["active", "completed", "discontinued", "on_hold"]).optional(),
          endDate: z.date().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateMedication(input.id, input.data);
        return { success: true };
      }),
  }),

  // ==================== BILLING ====================
  billing: router({
    list: protectedProcedure
      .input(z.object({ patientId: z.number().optional(), limit: z.number().default(50) }).optional())
      .query(async ({ input }) => {
        return db.getBillingTransactions(input?.patientId, input?.limit ?? 50);
      }),
    stats: protectedProcedure.query(async () => {
      return {
        monthlyRevenue: 1245000,
        collected: 980000,
        pending: 185000,
        qaRevenue: 342000,
      };
    }),
    create: protectedProcedure
      .input(z.object({
        patientId: z.number(),
        transactionId: z.string(),
        service: z.string(),
        category: z.enum(["consultation", "procedure", "medication", "lab_test", "package", "qna", "other"]).default("other"),
        amount: z.string(),
        discount: z.string().optional(),
        tax: z.string().optional(),
        totalAmount: z.string(),
        paymentMethod: z.enum(["cash", "card", "upi", "net_banking", "wallet", "insurance"]).optional(),
        dueDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createBillingTransaction(input);
        return { id };
      }),
  }),

  // ==================== KNOWLEDGE HUB ====================
  knowledge: router({
    list: protectedProcedure
      .input(z.object({ published: z.boolean().default(true) }).optional())
      .query(async ({ input }) => {
        return db.getKnowledgeContent(input?.published ?? true);
      }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        contentType: z.enum(["article", "video", "infographic", "faq", "guide"]).default("article"),
        category: z.string().optional(),
        summary: z.string().optional(),
        content: z.string().optional(),
        videoUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        isPublished: z.boolean().default(false),
        isFeatured: z.boolean().default(false),
        tags: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createKnowledgeContent(input);
        return { id };
      }),
  }),

  // ==================== QNA SESSIONS ====================
  qna: router({
    list: protectedProcedure
      .input(z.object({ patientId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getQnaSessions(input?.patientId);
      }),
    create: protectedProcedure
      .input(z.object({
        patientId: z.number(),
        question: z.string(),
        category: z.string().optional(),
        amount: z.string().optional(),
        attachmentUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createQnaSession(input);
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          answer: z.string().optional(),
          status: z.enum(["pending", "assigned", "answered", "closed"]).optional(),
          specialistId: z.number().optional(),
          rating: z.number().optional(),
          feedback: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateQnaSession(input.id, input.data);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
