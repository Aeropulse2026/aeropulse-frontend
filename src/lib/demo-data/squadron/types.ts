export type SquadronIdentity = {
  id: string;
  name: string;
  base: string;
  role: string;
};

export type MaintenanceTask = {
  id: string;
  aircraftId: string;
  component: string;
  action: string;
  status: "pending" | "in_progress" | "completed";
  priority: "routine" | "review" | "urgent";
  scheduledFor: string;
  completedAt?: string;
  evidence: "complete" | "incomplete";
  requiredPartId?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: "Aircraft" | "Controlled inventory" | "Spare parts" | "Operational equipment";
  quantity: number;
  reserved: number;
  serviceability: "Operational" | "Maintenance" | "Standby" | "Secured" | "Serviceable" | "Low stock" | "Out of stock" | "Available" | "Limited availability";
  location: string;
  unit: string;
  reorderPoint?: number;
};
