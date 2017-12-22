export interface Authorization {
  report_id: string
  created_by: string
  approved_by: string
  creation_date: string
  approval_date: string
  zone_name: string
  program_name: string
  module_name: string
  log_name: string
  time: string
  items: Array<AuthorizationItem>
}

export interface AuthorizationItem {
  id: number
  name: string
  test: number
  calibration: number
  sanitization: number
  deficiencies: string
  corrective_action: string
}