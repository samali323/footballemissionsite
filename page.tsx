import Link from "next/link"
import { ArrowRight, Globe2, Plane, TreePine, Calculator, ArrowDownToLine, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Tracking Football's Carbon Footprint
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Calculate and monitor the environmental impact of football team travel. Make informed decisions for a
                greener game.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/calculator">
                <Button className="bg-green-600 hover:bg-green-700">
                  Calculate Emissions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">The Impact of Football Travel</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Average Flight Emissions</CardTitle>
                <Plane className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 tons</div>
                <p className="text-xs text-muted-foreground">CO2 per team flight</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Annual Carbon Footprint</CardTitle>
                <Globe2 className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,000 tons</div>
                <p className="text-xs text-muted-foreground">CO2 from football travel</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                <TreePine className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">30%</div>
                <p className="text-xs text-muted-foreground">Reduction possible</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Calculator className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Enter Match Details</h3>
              <p className="text-muted-foreground">
                Input the teams, locations, and travel information for your matches
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <ArrowDownToLine className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Get Instant Results</h3>
              <p className="text-muted-foreground">
                Receive detailed calculations of CO2 emissions and environmental impact
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your environmental impact and identify areas for improvement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Making a Difference</h2>
              <p className="text-muted-foreground">
                By tracking and reducing football travel emissions, we can make a significant impact on the environment.
                Here's what your reductions could mean:
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <TreePine className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">50,000 Trees Worth</p>
                    <p className="text-sm text-muted-foreground">Of CO2 absorption annually</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Plane className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">3,000 Flights</p>
                    <p className="text-sm text-muted-foreground">Reduced carbon equivalent</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Globe2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">15% Reduction</p>
                    <p className="text-sm text-muted-foreground">In football's carbon footprint</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Start Making an Impact</h3>
                <p className="text-muted-foreground">
                  Ready to calculate your team's environmental impact? Use our calculator to get started and join the
                  movement for sustainable football.
                </p>
                <div className="space-y-2">
                  <Link href="/calculator">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Start Calculating
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

