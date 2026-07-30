"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TEAM_MEMBERS } from "@/config/team";
import { MemberStatus, STATUS_LABEL, STATUS_VALUES, StatusValue } from "@/types";
import { formatRelativeTime } from "@/lib/time";

const STORAGE_KEY = "papan-status-nama";
const POLL_INTERVAL_MS = 5000;

const STATUS_STYLE: Record<StatusValue, { badge: string; button: string; buttonActive: string }> = {
  belum_mulai: {
    badge: "bg-red-100 text-red-700",
    button: "border-red-300 text-red-700 bg-white",
    buttonActive: "border-red-500 bg-red-500 text-white",
  },
  dikerjakan: {
    badge: "bg-amber-100 text-amber-800",
    button: "border-amber-300 text-amber-800 bg-white",
    buttonActive: "border-amber-500 bg-amber-500 text-white",
  },
  selesai: {
    badge: "bg-emerald-100 text-emerald-700",
    button: "border-emerald-300 text-emerald-700 bg-white",
    buttonActive: "border-emerald-500 bg-emerald-500 text-white",
  },
};

export default function Home() {
  const [nameLoaded, setNameLoaded] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [pickerValue, setPickerValue] = useState<string>(TEAM_MEMBERS[0]);

  const [members, setMembers] = useState<MemberStatus[] | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftStatus, setDraftStatus] = useState<StatusValue>("belum_mulai");
  const [draftTugas, setDraftTugas] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (TEAM_MEMBERS as readonly string[]).includes(stored)) {
      setSelectedName(stored);
    }
    setNameLoaded(true);
  }, []);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setMembers(data.members);
    } catch {
      // Diamkan saja; percobaan berikutnya (polling) akan mencoba lagi.
    }
  }, []);

  useEffect(() => {
    fetchMembers();
    const interval = setInterval(fetchMembers, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchMembers]);

  const myRecord = useMemo(
    () => members?.find((m) => m.name === selectedName) ?? null,
    [members, selectedName]
  );

  function handleConfirmName() {
    window.localStorage.setItem(STORAGE_KEY, pickerValue);
    setSelectedName(pickerValue);
  }

  function handleChangeIdentity() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSelectedName(null);
    setEditing(false);
  }

  function openEdit() {
    setDraftStatus(myRecord?.status ?? "belum_mulai");
    setDraftTugas(myRecord?.tugas ?? "");
    setErrorMsg(null);
    setEditing(true);
  }

  async function handleSave() {
    if (!selectedName) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedName,
          status: draftStatus,
          tugas: draftTugas.trim(),
        }),
      });
      if (!res.ok) {
        throw new Error("Gagal menyimpan");
      }
      const data = await res.json();
      setMembers((prev) =>
        prev
          ? prev.map((m) => (m.name === selectedName ? data.member : m))
          : prev
      );
      setEditing(false);
    } catch {
      setErrorMsg("Gagal menyimpan. Coba lagi ya.");
    } finally {
      setSaving(false);
    }
  }

  if (!nameLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Memuat...</p>
      </div>
    );
  }

  if (!selectedName) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-center mb-2">Papan Status Tim</h1>
        <p className="text-lg text-slate-600 text-center mb-8">
          Pilih nama kamu untuk mulai
        </p>
        <select
          value={pickerValue}
          onChange={(e) => setPickerValue(e.target.value)}
          className="w-full max-w-xs text-xl p-4 rounded-xl border-2 border-slate-300 mb-6 bg-white"
        >
          {TEAM_MEMBERS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConfirmName}
          className="w-full max-w-xs text-xl font-semibold py-4 rounded-xl bg-blue-600 text-white active:bg-blue-700"
        >
          Lanjut
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Papan Status Tim</h1>
        <div className="text-right text-sm">
          <p className="text-slate-500">
            Kamu: <span className="font-semibold text-slate-800">{selectedName}</span>
          </p>
          <button onClick={handleChangeIdentity} className="text-blue-600 underline">
            bukan kamu?
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 flex flex-col gap-4">
        {members === null && <p className="text-center text-slate-400 py-8">Memuat data tim...</p>}

        {members?.map((member) => {
          const isMine = member.name === selectedName;
          const style = STATUS_STYLE[member.status];

          return (
            <div
              key={member.name}
              className={`rounded-2xl bg-white shadow-sm border-2 p-4 ${
                isMine ? "border-blue-300" : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-bold">
                  {member.name}
                  {isMine && <span className="text-blue-500 font-medium"> (kamu)</span>}
                </span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${style.badge}`}>
                  {STATUS_LABEL[member.status]}
                </span>
              </div>

              <p className="mt-2 text-base text-slate-700 break-words">
                {member.tugas || "Belum ada tugas"}
              </p>
              <p className="mt-1 text-xs text-slate-400">{formatRelativeTime(member.updatedAt)}</p>

              {isMine && !editing && (
                <button
                  onClick={openEdit}
                  className="mt-3 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold active:bg-blue-700"
                >
                  Ubah Status Saya
                </button>
              )}

              {isMine && editing && (
                <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-2">
                    {STATUS_VALUES.map((value) => {
                      const active = draftStatus === value;
                      const s = STATUS_STYLE[value];
                      return (
                        <button
                          key={value}
                          onClick={() => setDraftStatus(value)}
                          className={`py-3 rounded-xl border-2 text-sm font-semibold ${
                            active ? s.buttonActive : s.button
                          }`}
                        >
                          {STATUS_LABEL[value]}
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={draftTugas}
                      onChange={(e) => setDraftTugas(e.target.value.slice(0, 60))}
                      placeholder="Tugas singkat, contoh: Desain banner klien X"
                      maxLength={60}
                      className="w-full text-base p-3 rounded-xl border-2 border-slate-300"
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">{draftTugas.length}/60</p>
                  </div>

                  {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="flex-1 py-3 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold active:bg-blue-700 disabled:opacity-60"
                    >
                      {saving ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
