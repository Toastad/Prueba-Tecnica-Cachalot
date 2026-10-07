import crmData from './crm-data.json'

export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: string
  notes: string[]
  photo: string | null
  photoFit?: 'cover' | 'contain'
  photoPosition?: string
  photoScale?: number
}

export type DashboardStat = {
  label: string
  value: string
  detail: string
}

export type ActivityPoint = {
  day: string
  calls: number
  emails: number
  meetings: number
}

export type PipelineStage = {
  stage: string
  value: number
}

type CrmData = {
  stats: DashboardStat[]
  activity: ActivityPoint[]
  pipeline: PipelineStage[]
  contacts: Contact[]
}

const typedCrmData = crmData as CrmData

export const dashboardStats = typedCrmData.stats
export const weeklyActivity = typedCrmData.activity
export const pipelineStages = typedCrmData.pipeline
export const contacts = typedCrmData.contacts