const HERO_PROJECTS = [
  "ballaratboxsportsLogo",
  "compopsDash",
  "dtcLogo",
  "gotnextConcept",
  "hibari",
  "leadlyHero",
  "moaiDashboard",
  "moaiHero",
  "moaiLogin",
  "neqtar",
  "pdxHero",
  "redactedLogin",
  "sag1",
  "sag2",
  "suitsConfigure",
  "suitsHero",
  "tuf",
] as const;

export function getHeroProjects(): string[] {
  return [...HERO_PROJECTS];
}
