const illustrationByAirbase: Record<string, string> = {
  "AFS-AMB": "/airbase-ambala.webp",
  "AFS-HDN": "/airbase-ghaziabad.webp",
  "AFS-JDH": "/airbase-jodhpur.webp",
  "AFS-PUN": "/airbase-pune.webp",
  "AFS-TEZ": "/airbase-tezpur.webp",
  "AFS-SUL": "/airbase-sulur.webp",
};

export function getAirbaseIllustration(code: string): string | undefined {
  return illustrationByAirbase[code.trim().toUpperCase()];
}
