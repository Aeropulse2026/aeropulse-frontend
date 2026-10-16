import { CardNav } from "@/components/card-nav";
import { DemoSessionActions } from "@/components/layout/demo-session-actions";

export default function HeadquarterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CardNav
        logo="/aeropulse-mark.svg"
        logoAlt="Aeropulse headquarters"
        buttonLabel="HQ • AIR COMMAND"
        baseColor="#ffffff"
        menuColor="#0b1f33"
        buttonBgColor="#0b1f33"
        buttonTextColor="#ffffff"
        items={[
          {
            label: "Command",
            bgColor: "#0b1f33",
            textColor: "#ffffff",
            links: [
              { label: "Overview", href: "/headquarter", ariaLabel: "Headquarters overview" },
              { label: "Squadron management", href: "/headquarter/squadrons", ariaLabel: "Squadron management" },
            ],
          },
          {
            label: "Fleet",
            bgColor: "#d9f3f7",
            textColor: "#0b1f33",
            links: [
              { label: "Fleet overview", href: "/headquarter/fleet", ariaLabel: "Fleet overview" },
              { label: "Aircraft readiness", href: "/headquarter/fleet", ariaLabel: "Aircraft readiness" },
            ],
          },
          {
            label: "Reports",
            bgColor: "#fef3c7",
            textColor: "#451a03",
            links: [
              { label: "Airbase assets", href: "/headquarter/assets", ariaLabel: "Airbase assets" },
              { label: "Fleet statistics", href: "/headquarter/stats", ariaLabel: "Fleet statistics" },
            ],
          },
        ]}
      />
      <div className="mx-auto my-3 flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <p className="text-xs font-medium text-amber-800">DEMO PREVIEW · sample data, no operational connection</p>
        <DemoSessionActions role="Headquarters" />
      </div>
      {children}
    </>
  );
}
