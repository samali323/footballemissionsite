"use client"

import { useState, useEffect } from 'react'
import { 
  getLeagues, 
  getTeams, 
  getSeasons, 
  getMatchesBySeason 
} from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Globe2, 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  Plane 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// Sample data for visualizations
const emissionsData = [
  { month: "Jan", emissions: 240 },
  { month: "Feb", emissions: 320 },
  { month: "Mar", emissions: 280 },
  { month: "Apr", emissions: 360 },
  { month: "May", emissions: 420 },
  { month: "Jun", emissions: 380 },
  { month: "Jul", emissions: 340 },
  { month: "Aug", emissions: 390 },
  { month: "Sep", emissions: 410 },
]

// Sample team comparison data
const teamEmissions = [
  { team: "Manchester United", emissions: 320 },
  { team: "Liverpool", emissions: 280 },
  { team: "Arsenal", emissions: 250 },
  { team: "Chelsea", emissions: 290 },
  { team: "Manchester City", emissions: 310 },
]

// Recent flights data
const recentFlights = [
  { route: "Manchester United → Arsenal", distance: "209 km", emissions: "0.8 tons CO2", date: "Today" },
  { route: "Liverpool → Manchester City", distance: "312 km", emissions: "1.2 tons CO2", date: "Yesterday" },
  { route: "Chelsea → Liverpool", distance: "415 km", emissions: "1.6 tons CO2", date: "2 days ago" },
]

export default function DashboardPage() {
  const [leagues, setLeagues] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [seasons, setSeasons] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [selectedYear, setSelectedYear] = useState("2024")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch all data
        const leaguesData = await getLeagues()
        const teamsData = await getTeams()
        const seasonsData = await getSeasons()
        
        // Sort seasons by end date (most recent first)
        const sortedSeasons = [...seasonsData].sort((a, b) => 
          new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
        )
        
        // Set state with fetched data
        setLeagues(leaguesData)
        setTeams(teamsData)
        setSeasons(sortedSeasons)
        
        // Only fetch matches if there are seasons available
        if (sortedSeasons.length > 0) {
          const latestSeason = sortedSeasons[0]
          console.log("Latest season ID:", latestSeason.id)
          
          const matchesData = await getMatchesBySeason(latestSeason.id)
          console.log("Matches data:", matchesData)
          setMatches(matchesData)
        } else {
          console.log("No seasons available")
          setMatches([])
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err)
        toast({
          title: "Error loading data",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [toast])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <h1 className="text-2xl font-bold text-destructive">Error Loading Dashboard</h1>
          </div>
          <p className="mb-4 text-muted-foreground">
            {error instanceof Error ? error.message : 'An unknown error occurred while loading the dashboard data.'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Globe2 className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-lg font-semibold">Football Emissions Calculator</h2>
          <div className="ml-auto flex items-center space-x-4">
            <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
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
      
      <div className="flex-1 space-y-6 p-6 md:p-8">
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
              <CardTitle className="text-sm font-medium">Leagues</CardTitle>
              <Globe2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leagues.length}</div>
              <p className="text-xs text-muted-foreground">
                Total leagues tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teams.length}</div>
              <p className="text-xs text-muted-foreground">
                Total teams monitored
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matches</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.length}</div>
              <div className="text-xs text-muted-foreground">
                {matches.length === 0 ? (
                  <div className="flex items-center gap-1 text-amber-500">
                    <AlertCircle className="h-3 w-3" />
                    <span>No matches found</span>
                  </div>
                ) : (
                  "Matches in latest season"
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Monthly Emissions</CardTitle>
                  <CardDescription>CO2 emissions in metric tons per month</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={emissionsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="emissions" 
                        name="CO2 Emissions" 
                        stroke="#16a34a" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
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
                    <BarChart data={teamEmissions}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="team" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="emissions" 
                        name="CO2 Emissions" 
                        fill="#16a34a" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Flights</CardTitle>
                      <CardDescription>Latest team travel details</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">View all</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentFlights.map((flight, index) => (
                      <div key={index} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <Plane className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4 space-y-1 flex-1">
                          <p className="text-sm font-medium leading-none">{flight.route}</p>
                          <p className="text-sm text-muted-foreground">{flight.distance} • {flight.emissions}</p>
                        </div>
                        <div className="ml-auto text-sm font-medium text-muted-foreground">{flight.date}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Environmental Impact</CardTitle>
                  <CardDescription>Offset initiatives and goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Activity className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Tree Planting Initiative</p>
                        <p className="text-sm text-muted-foreground">38,940 trees to be planted to offset emissions</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Carbon Credits</p>
                        <p className="text-sm text-muted-foreground">2,340 carbon credits purchased this season</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Team Emissions Data</CardTitle>
                <CardDescription>Detailed breakdown by team</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Team data will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>In-depth environmental impact analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Advanced analytics will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
