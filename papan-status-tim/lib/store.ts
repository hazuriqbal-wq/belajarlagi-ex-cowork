import { Redis } from "@upstash/redis";
import { TEAM_MEMBERS } from "@/config/team";
import { MemberStatus, StatusValue } from "@/types";

// Vercel's Upstash Redis integration injects KV_REST_API_URL / KV_REST_API_TOKEN.
// UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are supported as a fallback
// in case you connected a plain Upstash database with different variable names.
const redis = new Redis({
  url: (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL)!,
  token: (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN)!,
});

// Semua status disimpan dalam satu hash Redis, satu field per anggota tim.
// Ini sengaja sesederhana mungkin: tidak perlu skema tabel/migrasi.
const HASH_KEY = "papan-status-tim";

function defaultStatus(name: string): MemberStatus {
  return { name, status: "belum_mulai", tugas: "", updatedAt: null };
}

export async function getAllStatuses(): Promise<MemberStatus[]> {
  const raw = await redis.hgetall<Record<string, MemberStatus>>(HASH_KEY);

  return TEAM_MEMBERS.map((name) => {
    const record = raw?.[name];
    if (!record) return defaultStatus(name);
    return {
      name,
      status: record.status,
      tugas: record.tugas ?? "",
      updatedAt: record.updatedAt ?? null,
    };
  });
}

export async function setStatus(
  name: string,
  status: StatusValue,
  tugas: string
): Promise<MemberStatus> {
  const record: MemberStatus = {
    name,
    status,
    tugas,
    updatedAt: new Date().toISOString(),
  };
  await redis.hset(HASH_KEY, { [name]: record });
  return record;
}
