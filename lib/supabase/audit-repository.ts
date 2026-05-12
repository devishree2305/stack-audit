import {
  createAdminClient,
  createReadonlyClient,
  hasAdminClientConfig,
} from "@/lib/supabase/server";
import type { AuditRepository } from "@/lib/audit-workflow";
import type { AuditFormValues, AuditToolInput, ToolRecommendation } from "@/types/audit";

type JsonAuditRow = {
  id: string;
  tools: unknown;
  team_size: number;
  primary_use_case: AuditFormValues["primaryUseCase"];
  current_monthly_spend: number;
  optimized_monthly_spend: number;
  total_monthly_savings: number;
  total_annual_savings: number;
  recommendations: unknown;
  ai_summary: string;
  share_token: string;
  created_at: string;
};

type JsonLeadRow = {
  id: string;
  audit_id: string;
  email: string;
  company_name: string | null;
  role: string | null;
  created_at: string;
};

function mapAuditRow(row: JsonAuditRow) {
  return {
    ...row,
    tools: row.tools as AuditToolInput[],
    recommendations: row.recommendations as ToolRecommendation[],
  };
}

function mapLeadRow(row: JsonLeadRow) {
  return row;
}

export function createSupabaseAuditRepository(): AuditRepository {
  async function getSupabaseClient() {
    const adminClient = createAdminClient();
    if (adminClient) {
      return adminClient;
    }

    return createReadonlyClient();
  }

  async function getAdminSupabaseClient() {
    const adminClient = createAdminClient();
    if (adminClient) {
      return adminClient;
    }

    if (!hasAdminClientConfig()) {
      throw new Error(
        "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local so the server can persist audits and leads.",
      );
    }

    throw new Error("Unable to initialize the Supabase admin client.");
  }

  return {
    async insertAudit(input) {
      const supabase = await getAdminSupabaseClient();
      const { data, error } = await supabase
        .from("audits")
        .insert(input)
        .select("*")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "Failed to save audit.");
      }

      return mapAuditRow(data as JsonAuditRow);
    },

    async getAuditByShareToken(shareToken) {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .eq("share_token", shareToken)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return data ? mapAuditRow(data as JsonAuditRow) : null;
    },

    async getAuditById(auditId) {
      const supabase = await getAdminSupabaseClient();
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .eq("id", auditId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return data ? mapAuditRow(data as JsonAuditRow) : null;
    },

    async findLeadByAuditAndEmail(auditId, email) {
      const supabase = await getAdminSupabaseClient();
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("audit_id", auditId)
        .eq("email", email)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return data ? mapLeadRow(data as JsonLeadRow) : null;
    },

    async insertLead(input) {
      const supabase = await getAdminSupabaseClient();
      const { data, error } = await supabase
        .from("leads")
        .insert(input)
        .select("*")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "Failed to save lead.");
      }

      return mapLeadRow(data as JsonLeadRow);
    },
  };
}
