import { DEMO_AS_OF_DATE, demoInventory, demoMaintenanceTasks, demoSquadron, demoSquadronAircraft } from "./data";
import type { InventoryItem, MaintenanceTask } from "./types";

export const getSquadronAircraft = () => demoSquadronAircraft.filter((aircraft) => aircraft.squadronId === demoSquadron.id);
export const getSquadronAircraftById = (id: string) => getSquadronAircraft().find((aircraft) => aircraft.id === id);
export const getSquadronTasks = () => demoMaintenanceTasks.filter((task) => getSquadronAircraftById(task.aircraftId));
export const getSquadronInventory = (): InventoryItem[] => [
  ...getSquadronAircraft().map((aircraft) => ({
    id: aircraft.id, name: `${aircraft.name} airframe`, category: "Aircraft" as const,
    quantity: 1, reserved: 0, serviceability: aircraft.status, location: aircraft.status === "Maintenance" ? "Hangar 2" : "Flight line", unit: "aircraft",
  })),
  ...demoInventory,
];

export const isLowStock = (item: InventoryItem) =>
  (item.category === "Spare parts" || item.category === "Operational equipment") && item.quantity - item.reserved <= 2;

export function getSquadronSummary() {
  const aircraft = getSquadronAircraft();
  const tasks = getSquadronTasks();
  const operational = aircraft.filter((item) => item.status === "Operational").length;
  const inMaintenance = aircraft.filter((item) => item.status === "Maintenance").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending" || task.status === "in_progress").length;
  return {
    totalAircraft: aircraft.length,
    operational,
    inMaintenance,
    unavailable: aircraft.filter((item) => item.status === "Standby").length,
    readiness: aircraft.length ? Math.round(aircraft.reduce((sum, item) => sum + item.readiness, 0) / aircraft.length) : null,
    pendingTasks,
    reviewTasks: tasks.filter((task) => task.priority === "review" || task.priority === "urgent" || task.evidence === "incomplete").length,
  };
}

export function searchSquadronTasks(tasks: readonly MaintenanceTask[], query: string) {
  const normalized = query.trim().toLowerCase();
  return tasks.filter((task) => !normalized || `${task.id} ${task.aircraftId} ${task.component} ${task.action} ${task.status}`.toLowerCase().includes(normalized));
}

export function filterSquadronTasks(tasks: readonly MaintenanceTask[], query: string, status: string) {
  return searchSquadronTasks(tasks, query).filter((task) => status === "All tasks" || task.status === status);
}

export function isTaskPastScheduledDate(task: MaintenanceTask, today = DEMO_AS_OF_DATE) {
  return task.status !== "completed" && task.scheduledFor < today;
}

export function getAvailableQuantity(item: InventoryItem) {
  return Math.max(0, item.quantity - item.reserved);
}

export function filterSquadronInventory(
  inventory: readonly InventoryItem[],
  filters: { query: string; category: string; lowStockOnly: boolean },
) {
  const normalizedQuery = filters.query.trim().toLowerCase();
  return inventory.filter((item) =>
    (!filters.lowStockOnly || isLowStock(item))
    && (filters.category === "All categories" || item.category === filters.category)
    && [item.id, item.name, item.location, item.category, item.serviceability].filter(Boolean).join(" ").toLowerCase().includes(normalizedQuery),
  );
}
