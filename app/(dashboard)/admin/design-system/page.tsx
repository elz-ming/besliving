import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftIcon,
  HomeIcon,
  SearchIcon,
} from "lucide-react";

export default function DesignSystemPage() {
  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Buttons */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Buttons
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Primary actions, secondary actions, and destructive operations.
            </p>
            <Card>
              <CardHeader>
                <CardTitle>Variants</CardTitle>
                <CardDescription>
                  Use default for primary, outline for secondary, destructive for
                  dangerous actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </CardContent>
              <CardHeader>
                <CardTitle>Sizes</CardTitle>
                <CardDescription>
                  xs, sm, default, lg, and icon variants.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-3">
                <Button size="xs" variant="outline">
                  Extra Small
                </Button>
                <Button size="sm" variant="outline">
                  Small
                </Button>
                <Button variant="outline">Default</Button>
                <Button size="lg" variant="outline">
                  Large
                </Button>
                <Button size="icon" variant="outline" aria-label="Home">
                  <HomeIcon />
                </Button>
              </CardContent>
              <CardHeader>
                <CardTitle>With icons</CardTitle>
                <CardDescription>
                  Icons use inline spacing automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button>
                  <SearchIcon data-icon="inline-start" />
                  Search
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin">
                    <ArrowLeftIcon data-icon="inline-start" />
                    Back to admin
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Cards */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Cards
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Content containers with header, body, and footer.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Unit listing</CardTitle>
                  <CardDescription>
                    Studio in Downtown • From $1,200/mo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Bright studio with private bathroom, shared kitchen. Ideal for
                    professionals.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">View details</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Compact card</CardTitle>
                  <CardDescription>Shorter content example</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use CardHeader, CardContent, CardFooter for structure.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Inputs */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Inputs
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Form fields with focus states and validation support.
            </p>
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input type="email" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Search
                    </label>
                    <Input placeholder="Search units..." />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-foreground">
                      Disabled
                    </label>
                    <Input placeholder="Disabled" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Badges */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Badges
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Labels for status, categories, and counts.
            </p>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Unavailable</Badge>
                  <Badge variant="ghost">Draft</Badge>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Use for: Published, Pending, Available, Occupied, etc.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Color tokens */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Brand colors
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              BesLiving palette — primary (turquoise), accent (purple), highlight
              (yellow).
            </p>
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-lg border border-border"
                      style={{ backgroundColor: "var(--color-turquoise)" }}
                    />
                    <div>
                      <p className="font-medium text-foreground">Turquoise</p>
                      <p className="text-xs text-muted-foreground">Primary</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-lg border border-border"
                      style={{ backgroundColor: "var(--color-purple)" }}
                    />
                    <div>
                      <p className="font-medium text-foreground">Purple</p>
                      <p className="text-xs text-muted-foreground">Accent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-lg border border-border"
                      style={{ backgroundColor: "var(--color-yellow)" }}
                    />
                    <div>
                      <p className="font-medium text-foreground">Yellow</p>
                      <p className="text-xs text-muted-foreground">Highlight</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
