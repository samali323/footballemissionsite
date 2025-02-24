"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Plane,
  Calendar,
  MapPin,
  Clock,
  Users,
  Leaf,
  DollarSign,
  Building,
  Search,
  AlertCircle,
  BarChart3,
  RefreshCw,
  Loader2
} from "lucide-react"

// Function to calculate distance between two coordinates (using Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// Function to calculate CO2 emissions based on distance
function calculateEmissions(distance, passengers = 25) {
  // Average emissions per passenger per km (in kg of CO2)
  const emissionsPerKm = 0.12;
  return (distance * emissionsPerKm * passengers).toFixed(2);
}

// Function to calculate cost based on distance
function calculateCost(distance) {
  // Rough estimate: $10 per km for a chartered flight
  const costPerKm = 10;
  return (distance * costPerKm).toFixed(2);
}

export default function MatchesPage() {
  const [leagues, setLeagues] = useState([])
  const [teams, setTeams] = useState([])
  const [seasons, setSeasons] = useState([])
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)

  const [selectedLeague, setSelectedLeague] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch leagues
        const { data: leaguesData, error: leaguesError } = await supabase
          .from('leagues')
          .select('*')

        if (leaguesError) throw leaguesError
        setLeagues(leaguesData)

        // Fetch teams
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('*')

        if (teamsError) throw teamsError
        setTeams(teamsData)

        // Fetch seasons
        const { data: seasonsData, error: seasonsError } = await supabase
          .from('seasons')
          .select('*')

        if (seasonsError) throw seasonsError
        setSeasons(seasonsData)

        // Don't fetch matches yet - wait for filters

      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch matches when filters change
  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true)

        // Start building the query
        let matchesQuery = supabase.from('matches').select(`
          id,
          date,
          league_id,
          season_id,
          home_team_id,
          away_team_id
        `)

        // Apply filters if they exist
        if (selectedLeague) {
          matchesQuery = matchesQuery.eq('league_id', selectedLeague)
        }

        if (selectedSeason) {
          // Handle the case where season_id might be a string like "2024-2025"
          matchesQuery = matchesQuery.eq('season_id', selectedSeason)
        }

        if (selectedTeam) {
          matchesQuery = matchesQuery.or(`home_team_id.eq.${selectedTeam},away_team_id.eq.${selectedTeam}`)
        }

        const { data: matchesData, error: matchesError } = await matchesQuery

        if (matchesError) throw matchesError

        // Enhance matches with team and league names
        const enhancedMatches = matchesData.map(match => {
          const homeTeam = teams.find(team => team.id === match.home_team_id)
          const awayTeam = teams.find(team => team.id === match.away_team_id)
          const league = leagues.find(league => league.id === match.league_id)
          const season = seasons.find(season => season.id === match.season_id)

          // If we have team city data, we can calculate distance and emissions
          let distance = null;
          let emissions = null;
          let cost = null;

          if (homeTeam && awayTeam && homeTeam.city && awayTeam.city) {
            // For this example, we'd typically have coordinates
            // Here we'll make some assumptions about the locations for demonstration

            // In a real app, you'd likely have a cities database with coordinates
            // or call a geolocation API

            // Mock data - in reality, these would be accurate coordinates
            const cities = {
              "Manchester": { lat: 53.4808, lon: -2.2426 },
              "Liverpool": { lat: 53.4084, lon: -2.9916 },
              "London": { lat: 51.5074, lon: -0.1278 },
              // Add more cities as needed
            };

            // Get coordinates or use placeholders
            const homeCoords = cities[homeTeam.city] || { lat: 51.5, lon: -0.1 };
            const awayCoords = cities[awayTeam.city] || { lat: 52.5, lon: -1.1 };

            distance = calculateDistance(
              homeCoords.lat, homeCoords.lon,
              awayCoords.lat, awayCoords.lon
            );

            emissions = calculateEmissions(distance);
            cost = calculateCost(distance);
          }

          return {
            ...match,
            homeTeamName: homeTeam ? homeTeam.name : 'Unknown Team',
            awayTeamName: awayTeam ? awayTeam.name : 'Unknown Team',
            homeCity: homeTeam ? homeTeam.city : 'Unknown',
            awayCity: awayTeam ? awayTeam.city : 'Unknown',
            leagueName: league ? league.name : 'Unknown League',
            seasonName: season ? season.id : 'Unknown Season',
            matchName: `${homeTeam ? homeTeam.name : 'Unknown'} vs ${awayTeam ? awayTeam.name : 'Unknown'}`,
            distance: distance ? distance.toFixed(1) : null,
            emissions: emissions,
            cost: cost
          }
        })

        setMatches(enhancedMatches)
        setFilteredMatches(enhancedMatches)

      } catch (err) {
        console.error("Error fetching matches:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch matches if we have loaded the reference data
    if (leagues.length > 0 && teams.length > 0 && seasons.length > 0) {
      fetchMatches()
    }
  }, [selectedLeague, selectedSeason, selectedTeam, leagues, teams, seasons])

  // Filter matches based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredMatches(matches)
      return
    }

    const lowercaseSearch = searchTerm.toLowerCase()

    const filtered = matches.filter(match =>
      match.homeTeamName.toLowerCase().includes(lowercaseSearch) ||
      match.awayTeamName.toLowerCase().includes(lowercaseSearch) ||
      match.leagueName.toLowerCase().includes(lowercaseSearch) ||
      match.homeCity.toLowerCase().includes(lowercaseSearch) ||
      match.awayCity.toLowerCase().includes(lowercaseSearch)
    )

    setFilteredMatches(filtered)
  }, [searchTerm, matches])

  const handleMatchSelect = (match) => {
    setSelectedMatch(match)
    setDetailsOpen(true)
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading && leagues.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading match data...</p>
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
            <h1 className="text-2xl font-bold text-destructive">Error Loading Matches</h1>
          </div>
          <p className="mb-6 text-muted-foreground">
            {error.message || 'An unknown error occurred while loading the match data.'}
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Match Emissions</h1>
          <p className="text-muted-foreground">
            View and analyze carbon emissions for individual football matches.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Match Filters</CardTitle>
            <CardDescription>
              Filter matches by league, season, team or search by name.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="league">League</Label>
                <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                  <SelectTrigger id="league">
                    <SelectValue placeholder="All Leagues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Leagues</SelectItem>
                    {leagues.map((league) => (
                      <SelectItem key={league.id} value={league.id}>
                        {league.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger id="season">
                    <SelectValue placeholder="All Seasons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Seasons</SelectItem>
                    {seasons.map((season) => (
                      <SelectItem key={season.id} value={season.id}>
                        {season.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger id="team">
                    <SelectValue placeholder="All Teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Teams</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search matches..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredMatches.length} of {matches.length} matches
            </div>
            <Button variant="outline" onClick={() => {
              setSelectedLeague("")
              setSelectedSeason("")
              setSelectedTeam("")
              setSearchTerm("")
            }}>
              Reset Filters
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="px-6 py-4">
            <div className="flex justify-between items-center">
              <CardTitle>Match Results</CardTitle>
              <Tabs defaultValue="all" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="all">All Matches</TabsTrigger>
                  <TabsTrigger value="highest">Highest Emissions</TabsTrigger>
                  <TabsTrigger value="recent">Most Recent</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] rounded-md border">
              {loading ? (
                <div className="flex h-20 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : filteredMatches.length === 0 ? (
                <div className="flex h-40 items-center justify-center flex-col">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No matches found matching your criteria</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead>League</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>CO₂ Emissions</TableHead>
                      <TableHead>Est. Cost</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatches.map((match) => (
                      <TableRow key={match.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleMatchSelect(match)}>
                        <TableCell className="font-medium">
                          {match.date ? formatDate(match.date) : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{match.homeTeamName} vs {match.awayTeamName}</div>
                          <div className="text-sm text-muted-foreground">{match.homeCity} → {match.awayCity}</div>
                        </TableCell>
                        <TableCell>
                          {match.leagueName}
                          <div className="text-xs text-muted-foreground">{match.seasonName}</div>
                        </TableCell>
                        <TableCell>
                          {match.distance ? (
                            <span>{match.distance} km</span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {match.emissions ? (
                            <Badge variant={parseFloat(match.emissions) > 10 ? "destructive" : "outline"}>
                              {match.emissions} kg
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {match.cost ? (
                            <span>${match.cost}</span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleMatchSelect(match);
                          }}>
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedMatch && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedMatch.homeTeamName} vs {selectedMatch.awayTeamName}
                </DialogTitle>
                <DialogDescription>
                  Match details and environmental impact analysis
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Match Information
                    </h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Date:</div>
                      <div>{selectedMatch.date ? formatDate(selectedMatch.date) : "N/A"}</div>

                      <div className="text-muted-foreground">League:</div>
                      <div>{selectedMatch.leagueName}</div>

                      <div className="text-muted-foreground">Season:</div>
                      <div>{selectedMatch.seasonName}</div>

                      <div className="text-muted-foreground">Home Team:</div>
                      <div>{selectedMatch.homeTeamName}</div>

                      <div className="text-muted-foreground">Away Team:</div>
                      <div>{selectedMatch.awayTeamName}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Location Details
                    </h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Origin:</div>
                      <div>{selectedMatch.homeCity}</div>

                      <div className="text-muted-foreground">Destination:</div>
                      <div>{selectedMatch.awayCity}</div>

                      <div className="text-muted-foreground">Flight Distance:</div>
                      <div>{selectedMatch.distance ? `${selectedMatch.distance} km` : "N/A"}</div>

                      <div className="text-muted-foreground">Estimated Duration:</div>
                      <div>{selectedMatch.distance ? `${(selectedMatch.distance / 800).toFixed(1)} hours` : "N/A"}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <Leaf className="mr-2 h-4 w-4" />
                      Environmental Impact
                    </h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">CO₂ Emissions:</div>
                      <div>{selectedMatch.emissions ? `${selectedMatch.emissions} kg` : "N/A"}</div>

                      <div className="text-muted-foreground">Trees Required:</div>
                      <div>
                        {selectedMatch.emissions
                          ? `${Math.ceil(parseFloat(selectedMatch.emissions) / 25)} trees`
                          : "N/A"}
                      </div>

                      <div className="text-muted-foreground">Offset Cost:</div>
                      <div>
                        {selectedMatch.emissions
                          ? `$${(parseFloat(selectedMatch.emissions) * 0.025).toFixed(2)}`
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Financial Information
                    </h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Estimated Flight Cost:</div>
                      <div className="font-medium">
                        {selectedMatch.cost ? `$${selectedMatch.cost}` : "N/A"}
                      </div>

                      <div className="text-muted-foreground">Fuel Cost:</div>
                      <div>
                        {selectedMatch.cost
                          ? `$${(parseFloat(selectedMatch.cost) * 0.4).toFixed(2)}`
                          : "N/A"}
                      </div>

                      <div className="text-muted-foreground">Personnel Cost:</div>
                      <div>
                        {selectedMatch.cost
                          ? `$${(parseFloat(selectedMatch.cost) * 0.3).toFixed(2)}`
                          : "N/A"}
                      </div>

                      <div className="text-muted-foreground">Other Expenses:</div>
                      <div>
                        {selectedMatch.cost
                          ? `$${(parseFloat(selectedMatch.cost) * 0.3).toFixed(2)}`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Comparison to Average
                </h3>
                <Separator className="my-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  This match's emissions compared to the league average for similar distance flights.
                </p>

                {selectedMatch.emissions ? (
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary">
                          {parseFloat(selectedMatch.emissions) < 30 ? "Below Average" :
                           parseFloat(selectedMatch.emissions) < 50 ? "Average" : "Above Average"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-primary">
                          {parseFloat(selectedMatch.emissions)} kg CO₂
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-muted">
                      <div
                        style={{ width: `${Math.min(parseFloat(selectedMatch.emissions) / 100 * 100, 100)}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          parseFloat(selectedMatch.emissions) < 30 ? "bg-green-500" :
                          parseFloat(selectedMatch.emissions) < 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 kg</span>
                      <span>50 kg</span>
                      <span>100+ kg</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">Comparison data not available</div>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                <Button>Download Report</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
