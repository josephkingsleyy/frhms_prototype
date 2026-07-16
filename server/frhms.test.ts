import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "dr.ananya@frhms.com",
    name: "Dr. Ananya",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("FRHMS Router Structure", () => {
  it("has all expected routers defined", () => {
    const caller = appRouter.createCaller(createAuthContext());
    
    // Verify all routers exist
    expect(caller.auth).toBeDefined();
    expect(caller.patients).toBeDefined();
    expect(caller.appointments).toBeDefined();
    expect(caller.clinicalAssessments).toBeDefined();
    expect(caller.ivfCycles).toBeDefined();
    expect(caller.embryology).toBeDefined();
    expect(caller.labResults).toBeDefined();
    expect(caller.medications).toBeDefined();
    expect(caller.billing).toBeDefined();
    expect(caller.knowledge).toBeDefined();
    expect(caller.qna).toBeDefined();
    expect(caller.dashboard).toBeDefined();
  });

  it("auth.me returns the authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.name).toBe("Dr. Ananya");
    expect(result?.email).toBe("dr.ananya@frhms.com");
    expect(result?.role).toBe("admin");
  });

  it("auth.logout clears the session cookie", async () => {
    const clearedCookies: any[] = [];
    const ctx: TrpcContext = {
      ...createAuthContext(),
      res: {
        clearCookie: (name: string, options: any) => {
          clearedCookies.push({ name, options });
        },
      } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies.length).toBe(1);
  });
});

describe("FRHMS Dashboard", () => {
  it("dashboard.stats returns expected structure", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const stats = await caller.dashboard.stats();
    expect(stats).toBeDefined();
    expect(typeof stats.totalPatients).toBe("number");
    expect(typeof stats.totalAppointments).toBe("number");
    expect(typeof stats.activeCycles).toBe("number");
  });
});

describe("FRHMS Patients", () => {
  it("patients.list returns an array", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const patients = await caller.patients.list({ limit: 10, offset: 0 });
    expect(Array.isArray(patients)).toBe(true);
  });
});
