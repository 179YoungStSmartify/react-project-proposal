import { useState } from "react";
import { Menu, Printer } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
const links = [
  ["#/", "Proposal"],
  ["#/network", "Network design"],
  ["#/viewer", "3D home viewer"],
] as const;
export function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="top">
      <a href="#/" className="brand">
        <span className="brand-mark">179</span>
        <span>
          Young Street <small>SMART HOME PROPOSAL</small>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([href, label]) => (
          <a
            key={href}
            href={href}
            aria-current={href === `#${path}` ? "page" : undefined}
          >
            {label}
          </a>
        ))}
        <Button variant="outline" onClick={() => window.print()}>
          <Printer aria-hidden="true" />
          Print proposal
        </Button>
      </nav>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="menu"
            aria-label="Toggle navigation"
          >
            <Menu aria-hidden="true" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent className="mobile-sheet">
          <SheetHeader>
            <SheetTitle>179 Young Street</SheetTitle>
            <SheetDescription>
              Explore the smart home proposal.
            </SheetDescription>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="mobile-nav">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                aria-current={href === `#${path}` ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                window.print();
              }}
            >
              <Printer aria-hidden="true" />
              Print proposal
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
