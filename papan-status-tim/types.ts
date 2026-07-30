export const STATUS_VALUES = ["belum_mulai", "dikerjakan", "selesai"] as const;

export type StatusValue = (typeof STATUS_VALUES)[number];

export interface MemberStatus {
  name: string;
  status: StatusValue;
  tugas: string;
  updatedAt: string | null;
}

export const STATUS_LABEL: Record<StatusValue, string> = {
  belum_mulai: "Belum Mulai",
  dikerjakan: "Dikerjakan",
  selesai: "Selesai",
};
