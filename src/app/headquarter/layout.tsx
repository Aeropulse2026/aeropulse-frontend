import { CardNav } from "@/components/card-nav";

export default function HeadquarterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CardNav
        logo="/vayunetra-logo.png"
        logoAlt="VAYUNETRA"
        buttonLabel="HQ • AIR COMMAND"
        baseColor="#ffffff"
        menuColor="#0b1f33"
        buttonBgColor="#0b1f33"
        buttonTextColor="#ffffff"
        sessionRole="headquarters"
        contentSized
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
              { label: "Network fleet", href: "/headquarter/fleet", ariaLabel: "Network fleet" },
              { label: "Fleet overview", href: "/headquarter/fleet-overview", ariaLabel: "Fleet overview" },
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

      {children}
    </>
  );
}
