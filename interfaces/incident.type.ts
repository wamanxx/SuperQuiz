import { Database } from "@/lib/database";

type IncidentType = Database["public"]["Tables"]["incidents"]["Row"];

export type {IncidentType}