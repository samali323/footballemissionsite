import { 
  getLeagues, 
  getTeams, 
  getSeasons, 
  getMatchesBySeason 
} from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe2, Users, Calendar } from "lucide-react"

export default async function DashboardPage() {
  try {
    const leagues = await getLeagues()
    const teams = await getTeams()
    const seasons = await getSeasons()

    const latestSeason = seasons.length > 0
      ? seasons.sort((a, b) =>
          new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
        )[0]
      : null

    const matches = latestSeason
      ? await getMatchesBySeason(latestSeason.id)
      : []

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Football Emissions Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Leagues</CardTitle>
              <Globe2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leagues.length}</div>
              <p className="text-xs text-muted-foreground">
                Total number of leagues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teams.length}</div>
              <p className="text-xs text-muted-foreground">
                Total number of teams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Matches</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.length}</div>
              <p className="text-xs text-muted-foreground">
                Matches in latest season
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1 className="text-2xl font-bold">Error Loading Dashboard</h1>
        <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
      </div>
    )
  }
}
