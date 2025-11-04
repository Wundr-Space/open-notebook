import apiClient from './client'

export interface OrganizationDetails {
  organizationName: string
  domain: string
  description: string
}

export interface AdminAccount {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword?: string // Only used in frontend
}

export interface InstanceConfiguration {
  subdomain: string
  region: string
  aiProvider: 'ollama' | 'openai' | 'anthropic'
  enablePublicAccess: boolean
  storageSize: string
}

export interface ProvisioningRequest {
  organizationDetails: OrganizationDetails
  adminAccount: Omit<AdminAccount, 'confirmPassword'>
  instanceConfiguration: InstanceConfiguration
  requestId?: string
}

export interface ProvisioningResponse {
  requestId: string
  status: string
  message: string
  instanceUrl?: string
  estimatedCompletionTime?: number
}

export interface ProvisioningStatus {
  requestId: string
  status: 'pending' | 'provisioning' | 'configuring' | 'finalizing' | 'complete' | 'failed'
  progress: number
  message: string
  instanceUrl?: string
  createdAt: string
  updatedAt: string
  error?: string
}

export interface SubdomainAvailability {
  available: boolean
  subdomain: string
}

export const provisioningApi = {
  /**
   * Create a new instance
   */
  createInstance: async (request: ProvisioningRequest): Promise<ProvisioningResponse> => {
    const response = await apiClient.post<ProvisioningResponse>(
      '/provisioning/instances',
      request
    )
    return response.data
  },

  /**
   * Get provisioning status
   */
  getStatus: async (requestId: string): Promise<ProvisioningStatus> => {
    const response = await apiClient.get<ProvisioningStatus>(
      `/provisioning/instances/${requestId}/status`
    )
    return response.data
  },

  /**
   * Check subdomain availability
   */
  checkSubdomainAvailability: async (subdomain: string): Promise<SubdomainAvailability> => {
    const response = await apiClient.get<SubdomainAvailability>(
      `/provisioning/subdomains/${subdomain}/available`
    )
    return response.data
  },
}

export default provisioningApi
