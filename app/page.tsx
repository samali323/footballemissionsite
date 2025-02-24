import { 
  getLeagues, 
  getTeams, 
  getSeasons, 
  getMatchesBySeason 
} from '@/lib/data'

export default async function Dashboard() {
  const leagues = await getLeagues()
  const teams = await getTeams()
  const seasons = await getSeasons()

  // Select the most recent season
  const latestSeason = seasons.sort((a, b) => 
    new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
  )[0]

  const matches = await getMatchesBySeason(latestSeason.id)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Emissions Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Leagues</h2>
          <ul>
            {leagues.map(league => (
              <li key={league.id}>{league.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Teams</h2>
          <ul>
            {teams.map(team => (
              <li key={team.id}>{team.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Recent Matches</h2>
          <ul>
            {matches.map(match => (
              <li key={match.id}>
                Match on {new Date(match.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
