import { CardNav } from "@/components/card-nav"

export default function SquadronLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CardNav
        logo="/aeropulse-mark.svg"
        logoAlt="Aeropulse squadron"
        buttonLabel="SQUADRON · COMMAND"
        baseColor="#ffffff"
        menuColor="#0b1f33"
        buttonBgColor="#0b1f33"
        buttonTextColor="#ffffff"
        sessionRole="squadron-leader"
        items={[
          {
            label: "Command",
            bgColor: "#0b1f33",
            textColor: "#ffffff",
            links: [
              { label: "Overview", href: "/squadron", ariaLabel: "Squadron overview" },
              { label: "Fleet management", href: "/squadron/fleet", ariaLabel: "Squadron fleet" },
            ],
          },
          {
            label: "Assets",
            bgColor: "#d9f3f7",
            textColor: "#0b1f33",
            links: [
              { label: "Asset management", href: "/squadron/assets", ariaLabel: "Squadron assets" },
            ],
          },
        ]}
      />
      {children}
    </>
  )
}
