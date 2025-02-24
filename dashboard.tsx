"use client"

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { CalendarIcon, Globe2, Plane, TreePine } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const emissionsData = [
  {
    month: "Jan",
    emissions: 240,
  },
  {
    month: "Feb",
    emissions: 320,
  },
  {
    month: "Mar",
    emissions: 280,
  },
  {
    month: "Apr",
    emissions: 360,
  },
  {
    month: "May",
    emissions: 420,
  },
  {
    month: "Jun",
    emissions: 380,
  },
]

const teamComparison = [
  {
    team: "Manchester United",
    emissions: 320,
  },
  {
    team: "Liverpool",
    emissions: 280,
  },
  {
    team: "Arsenal",
    emissions: 250,
  },
  {
    team: "Chelsea",
    emissions: 290,
  },
  {
    team: "Manchester City",
    emissions: 310,
  },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Globe2 className="h-6 w-6 text-green-600" />
          <h2 className="ml-2 text-lg font-semibold">Soccer Flight Emissions</h2>
          <div className="ml-auto flex items-center space-x-4">
            <Select defaultValue="2024">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024 Season</SelectItem>
                <SelectItem value="2023">2023 Season</SelectItem>
                <SelectItem value="2022">2022 Season</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,340</div>
              <p className="text-xs text-muted-foreground">Metric tons of CO2</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
              <Globe2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128,450</div>
              <p className="text-xs text-muted-foreground">Kilometers flown</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trees Required</CardTitle>
              <TreePine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38,940</div>
              <p className="text-xs text-muted-foreground">To offset emissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">284</div>
              <p className="text-xs text-muted-foreground">This season</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Monthly Emissions</CardTitle>
                  <CardDescription>CO2 emissions in metric tons per month</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={emissionsData}>
                      <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Line type="monotone" dataKey="emissions" stroke="#16a34a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Team Comparison</CardTitle>
                  <CardDescription>CO2 emissions by team (metric tons)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={teamComparison}>
                      <XAxis dataKey="team" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Bar dataKey="emissions" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Flights</CardTitle>
                  <CardDescription>Latest team travel details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Manchester United → Arsenal</p>
                        <p className="text-sm text-muted-foreground">209 km • 0.8 metric tons CO2</p>
                      </div>
                      <div className="ml-auto font-medium">Today</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Liverpool → Manchester City</p>
                        <p className="text-sm text-muted-foreground">312 km • 1.2 metric tons CO2</p>
                      </div>
                      <div className="ml-auto font-medium">Yesterday</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Chelsea → Liverpool</p>
                        <p className="text-sm text-muted-foreground">415 km • 1.6 metric tons CO2</p>
                      </div>
                      <div className="ml-auto font-medium">2 days ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                  <CardDescription>Offset initiatives and goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <TreePine className="h-4 w-4 text-green-600" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Tree Planting Initiative</p>
                        <p className="text-sm text-muted-foreground">38,940 trees to be planted</p>
                      </div>
                      <Button variant="outline">View</Button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Globe2 className="h-4 w-4 text-green-600" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Carbon Credits</p>
                        <p className="text-sm text-muted-foreground">2,340 credits purchased</p>
                      </div>
                      <Button variant="outline">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

