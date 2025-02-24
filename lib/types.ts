export interface League {
  id: number
  name: string
  country: string
}

export interface Team {
  id: number
  name: string
  city: string
  country: string
  stadium: string
  capacity: number
  founded: number
}

export interface Season {
  id: number
  start_date: string
  end_date: string
}

export interface Match {
  id: number
  date: string
  league_id: number
  season_id: number
  home_team_id: number
  away_team_id: number
}

export interface Airport {
  id: number
  team_id: number
  iata_code: string
  airport_name: string
  latitude: number
  longitude: number
}
