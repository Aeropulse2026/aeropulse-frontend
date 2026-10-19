const illustrationByModel: Record<string, string> = {
  "multirole fighter": "/fleet-aircraft-illustration.png",
  "air superiority": "/fleet-air-superiority.png",
  "advanced trainer": "/fleet-advanced-trainer.png",
  surveillance: "/fleet-surveillance.png",
  "strategic transport": "/fleet-strategic-transport.png",
  "heavy transport": "/fleet-heavy-transport.png",
};

export function getAircraftIllustration(model: string): string | undefined {
  return illustrationByModel[model.trim().toLowerCase()];
}
