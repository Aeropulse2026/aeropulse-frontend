import { CardNav } from "@/components/card-nav"
import { DemoSessionActions } from "@/components/layout/demo-session-actions"

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
      <div className="mx-auto my-3 flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <p className="text-xs font-medium text-amber-800">DEMO PREVIEW · sample data, no operational connection</p>
        <DemoSessionActions role="Squadron Leader" />
      </div>
      {children}
    </>
  )
}
