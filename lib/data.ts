import { supabase } from './supabase'
import { League, Team, Season, Match } from './types'

export async function getLeagues(): Promise<League[]> {
  const { data, error } = await supabase
    .from('leagues')
    .select('*')

  if (error) throw error
  return data || []
}

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')

  if (error) throw error
  return data || []
}

export async function getSeasons(): Promise<Season[]> {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')

  if (error) throw error
  return data || []
}

export async function getMatchesBySeason(seasonId: number): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('season_id', seasonId)

  if (error) throw error
  return data || []
}
