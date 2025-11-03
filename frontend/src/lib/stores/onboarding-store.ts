import { create } from 'zustand'

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
  confirmPassword: string
}

export interface InstanceConfiguration {
  subdomain: string
  region: string
  aiProvider: 'ollama' | 'openai' | 'anthropic'
  enablePublicAccess: boolean
  storageSize: string
}

export interface OnboardingState {
  currentStep: number
  organizationDetails: Partial<OrganizationDetails>
  adminAccount: Partial<AdminAccount>
  instanceConfiguration: Partial<InstanceConfiguration>
  isSubmitting: boolean

  // Actions
  setCurrentStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  updateOrganizationDetails: (data: Partial<OrganizationDetails>) => void
  updateAdminAccount: (data: Partial<AdminAccount>) => void
  updateInstanceConfiguration: (data: Partial<InstanceConfiguration>) => void
  setIsSubmitting: (isSubmitting: boolean) => void
  resetWizard: () => void
}

const initialState = {
  currentStep: 1,
  organizationDetails: {},
  adminAccount: {},
  instanceConfiguration: {
    aiProvider: 'ollama' as const,
    enablePublicAccess: false,
    region: 'us-central1',
    storageSize: '10GB',
  },
  isSubmitting: false,
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),

  previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  updateOrganizationDetails: (data) =>
    set((state) => ({
      organizationDetails: { ...state.organizationDetails, ...data },
    })),

  updateAdminAccount: (data) =>
    set((state) => ({
      adminAccount: { ...state.adminAccount, ...data },
    })),

  updateInstanceConfiguration: (data) =>
    set((state) => ({
      instanceConfiguration: { ...state.instanceConfiguration, ...data },
    })),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  resetWizard: () => set(initialState),
}))
