import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type SolidKapanalig = {
  id: string;
  rankNumber: number; // 1, 2, 3, etc.
  name: string;
  month: string;
  avatarUrl?: string | undefined;
  bio?: string | undefined;
  badge?: string | undefined;
  createdAt?: string | undefined;
};

type DbKapanalig = {
  id: string;
  rank_number?: number | null;
  rankNumber?: number | null;
  name: string;
  month?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  badge?: string | null;
  created_at?: string | null;
};

// Clean initial array without dummy data
export const INITIAL_KAPANALIGS: SolidKapanalig[] = [];

const LOCAL_STORAGE_KEY = "amen-solid-kapanaligs";

export function useSolidKapanaligs() {
  const [kapanaligs, setKapanaligs] = useState<SolidKapanalig[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // If the stored data is only the previous dummy data, clear it
        if (
          Array.isArray(parsed) &&
          parsed.some((item: SolidKapanalig) => item.id?.startsWith("kapanalig-"))
        ) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          return [];
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_KAPANALIGS;
  });

  const [loading, setLoading] = useState(true);
  const [isUsingCloud, setIsUsingCloud] = useState(false);

  const fetchKapanaligs = async () => {
    try {
      const { data, error } = await supabase
        .from("solid_kapanaligs")
        .select("*")
        .order("rank_number", { ascending: true });

      if (!error && data) {
        const mapped: SolidKapanalig[] = data.map((d: DbKapanalig) => ({
          id: String(d.id),
          rankNumber: Number(d.rank_number ?? d.rankNumber ?? 99),
          name: d.name,
          month: d.month || "October 2026",
          avatarUrl: d.avatar_url || d.avatarUrl || "",
          bio: d.bio || "",
          badge: d.badge || "",
          createdAt: d.created_at || undefined,
        }));
        mapped.sort((a, b) => a.rankNumber - b.rankNumber);
        setKapanaligs(mapped);
        setIsUsingCloud(true);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped));
      } else if (error) {
        console.warn("Supabase solid_kapanaligs note:", error.message);
        setIsUsingCloud(false);
      }
    } catch (err) {
      console.warn("Could not query Supabase solid_kapanaligs:", err);
      setIsUsingCloud(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKapanaligs();

    // Subscribe to Supabase Realtime changes
    const channel = supabase
      .channel("solid-kapanaligs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "solid_kapanaligs" },
        () => {
          fetchKapanaligs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /**
   * ADD: If we add a new item at rank N, shift any existing items with rank >= N down by 1 (+1).
   * E.g. If rank 3 exists and we add a new rank 3, old 3 becomes 4, old 4 becomes 5, etc.
   */
  const add = async (item: Omit<SolidKapanalig, "id">) => {
    const id = crypto.randomUUID();
    const targetRank = Math.max(1, item.rankNumber);

    // Calculate updated list with shifted ranks
    const shiftedList: SolidKapanalig[] = [];
    const itemsToUpdateInDb: SolidKapanalig[] = [];

    kapanaligs.forEach((existing) => {
      if (existing.rankNumber >= targetRank) {
        const updatedItem = {
          ...existing,
          rankNumber: existing.rankNumber + 1,
        };
        shiftedList.push(updatedItem);
        itemsToUpdateInDb.push(updatedItem);
      } else {
        shiftedList.push(existing);
      }
    });

    const newItem: SolidKapanalig = {
      ...item,
      id,
      rankNumber: targetRank,
    };

    shiftedList.push(newItem);
    shiftedList.sort((a, b) => a.rankNumber - b.rankNumber);

    // Update local state immediately
    setKapanaligs(shiftedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shiftedList));

    try {
      // 1. Shift existing records in Supabase
      if (itemsToUpdateInDb.length > 0) {
        for (const shifted of itemsToUpdateInDb) {
          await supabase
            .from("solid_kapanaligs")
            .update({ rank_number: shifted.rankNumber })
            .eq("id", shifted.id);
        }
      }

      // 2. Insert new record in Supabase
      const { error } = await supabase.from("solid_kapanaligs").insert([
        {
          id: newItem.id,
          rank_number: newItem.rankNumber,
          name: newItem.name,
          month: newItem.month,
          avatar_url: newItem.avatarUrl || "",
          bio: newItem.bio || "",
          badge: newItem.badge || "",
        },
      ]);

      if (!error) {
        setIsUsingCloud(true);
        await fetchKapanaligs();
      }
    } catch (err) {
      console.warn("Could not insert into Supabase solid_kapanaligs:", err);
    }
  };

  /**
   * DELETE: If we delete rank N, shift all items with rank > N up by 1 (-1).
   * E.g. If we delete 3 and there's 4, 4 becomes 3, 5 becomes 4, etc.
   */
  const remove = async (id: string) => {
    const targetItem = kapanaligs.find((k) => k.id === id);
    if (!targetItem) return;

    const deletedRank = targetItem.rankNumber;

    const updatedList: SolidKapanalig[] = [];
    const itemsToUpdateInDb: SolidKapanalig[] = [];

    kapanaligs.forEach((existing) => {
      if (existing.id === id) {
        // Skip deleted item
        return;
      }
      if (existing.rankNumber > deletedRank) {
        const shifted = {
          ...existing,
          rankNumber: existing.rankNumber - 1,
        };
        updatedList.push(shifted);
        itemsToUpdateInDb.push(shifted);
      } else {
        updatedList.push(existing);
      }
    });

    updatedList.sort((a, b) => a.rankNumber - b.rankNumber);
    setKapanaligs(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

    try {
      // 1. Delete from Supabase
      await supabase.from("solid_kapanaligs").delete().eq("id", id);

      // 2. Shift remaining records in Supabase
      for (const shifted of itemsToUpdateInDb) {
        await supabase
          .from("solid_kapanaligs")
          .update({ rank_number: shifted.rankNumber })
          .eq("id", shifted.id);
      }

      await fetchKapanaligs();
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }
  };

  /**
   * UPDATE: If rank changes, re-order smoothly so numbers stay sequential
   */
  const update = async (item: SolidKapanalig) => {
    const currentItem = kapanaligs.find((k) => k.id === item.id);
    const oldRank = currentItem?.rankNumber ?? item.rankNumber;
    const newRank = item.rankNumber;

    let updatedList: SolidKapanalig[] = [];
    const itemsToUpdateInDb: SolidKapanalig[] = [];

    if (oldRank === newRank) {
      updatedList = kapanaligs.map((k) => (k.id === item.id ? item : k));
    } else if (newRank < oldRank) {
      // Shift items between [newRank, oldRank - 1] up by +1
      kapanaligs.forEach((existing) => {
        if (existing.id === item.id) {
          updatedList.push(item);
        } else if (existing.rankNumber >= newRank && existing.rankNumber < oldRank) {
          const shifted = { ...existing, rankNumber: existing.rankNumber + 1 };
          updatedList.push(shifted);
          itemsToUpdateInDb.push(shifted);
        } else {
          updatedList.push(existing);
        }
      });
    } else {
      // newRank > oldRank: Shift items between [oldRank + 1, newRank] down by -1
      kapanaligs.forEach((existing) => {
        if (existing.id === item.id) {
          updatedList.push(item);
        } else if (existing.rankNumber > oldRank && existing.rankNumber <= newRank) {
          const shifted = { ...existing, rankNumber: existing.rankNumber - 1 };
          updatedList.push(shifted);
          itemsToUpdateInDb.push(shifted);
        } else {
          updatedList.push(existing);
        }
      });
    }

    updatedList.sort((a, b) => a.rankNumber - b.rankNumber);
    setKapanaligs(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

    try {
      // Update shifted items in DB
      for (const shifted of itemsToUpdateInDb) {
        await supabase
          .from("solid_kapanaligs")
          .update({ rank_number: shifted.rankNumber })
          .eq("id", shifted.id);
      }

      // Update target item
      await supabase
        .from("solid_kapanaligs")
        .update({
          rank_number: item.rankNumber,
          name: item.name,
          month: item.month,
          avatar_url: item.avatarUrl || "",
          bio: item.bio || "",
          badge: item.badge || "",
        })
        .eq("id", item.id);

      await fetchKapanaligs();
    } catch (err) {
      console.warn("Supabase update error:", err);
    }
  };

  return {
    kapanaligs,
    loading,
    isUsingCloud,
    add,
    update,
    remove,
    refresh: fetchKapanaligs,
  };
}
