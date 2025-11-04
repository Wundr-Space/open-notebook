'use client'

import { useOnboardingStore } from '@/lib/stores/onboarding-store'
import { AxiosError } from 'axios'
import { useState } from 'react'
import {
  Building2,
  Globe,
  User,
  Mail,
  Server,
  MapPin,
  Cpu,
  Database,
  Shield,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { provisioningApi } from '@/lib/api/provisioning'
import { toast } from 'sonner'

export function Step4ReviewDeploy() {
  const {
    organizationDetails,
    adminAccount,
    instanceConfiguration,
    previousStep,
    setIsSubmitting,
    setProvisioningRequestId,
    isSubmitting,
  } = useOnboardingStore()
  const router = useRouter()
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success'>(
    'idle'
  )
  const [error, setError] = useState<string | null>(null)

  const handleDeploy = async () => {
    try {
      setIsSubmitting(true)
      setDeploymentStatus('deploying')
      setError(null)

      // Prepare the request data
      const request = {
        organizationDetails: {
          organizationName: organizationDetails.organizationName!,
          domain: organizationDetails.domain!,
          description: organizationDetails.description!,
        },
        adminAccount: {
          firstName: adminAccount.firstName!,
          lastName: adminAccount.lastName!,
          email: adminAccount.email!,
          password: adminAccount.password!,
        },
        instanceConfiguration: {
          subdomain: instanceConfiguration.subdomain!,
          region: instanceConfiguration.region!,
          aiProvider: instanceConfiguration.aiProvider!,
          enablePublicAccess: instanceConfiguration.enablePublicAccess!,
          storageSize: instanceConfiguration.storageSize!,
        },
      }

      // Call the provisioning API
      const response = await provisioningApi.createInstance(request)

      // Save the request ID for tracking
      setProvisioningRequestId(response.requestId)

      setDeploymentStatus('success')
      toast.success('Provisioning started successfully!')

      // Redirect to success page after a brief delay
      setTimeout(() => {
        router.push('/space/onboard/success')
      }, 1500)
    } catch (err: unknown) {
      const errorMessage = err instanceof AxiosError
        ? err.response?.data?.detail || err.message
        : 'Failed to start provisioning. Please try again.'
      
      setError(errorMessage)
      toast.error('Failed to start provisioning')
      setDeploymentStatus('idle')
    } finally {
      setIsSubmitting(false)
    }
  }

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType
    label: string
    value: string
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <Icon className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-400">{label}</div>
        <div className="font-medium text-white mt-1 break-words">{value}</div>
      </div>
    </div>
  )

  if (deploymentStatus === 'success') {
    return (
      <div className="space-y-8 text-center py-12">
        <div className="flex justify-center">
          <div className="rounded-full bg-emerald-500/20 p-4">
            <CheckCircle className="h-12 w-12 text-emerald-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Deployment Started!</h2>
          <p className="text-slate-400">
            Your Knowledge Space is being provisioned. This will take a few minutes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Review & Deploy</h2>
        <p className="text-slate-400">
          Please review your configuration before we deploy your Knowledge Space.
        </p>
      </div>

      {/* Organization Details */}
      <div className="rounded-lg border border-white/10 bg-[#0e1526] p-6 space-y-1">
        <h3 className="text-lg font-semibold mb-4">Organization Details</h3>
        <InfoRow
          icon={Building2}
          label="Organization Name"
          value={organizationDetails.organizationName || 'Not provided'}
        />
        <InfoRow
          icon={Globe}
          label="Domain"
          value={organizationDetails.domain || 'Not provided'}
        />
        <InfoRow
          icon={Building2}
          label="Description"
          value={organizationDetails.description || 'Not provided'}
        />
      </div>

      {/* Admin Account */}
      <div className="rounded-lg border border-white/10 bg-[#0e1526] p-6 space-y-1">
        <h3 className="text-lg font-semibold mb-4">Administrator Account</h3>
        <InfoRow
          icon={User}
          label="Name"
          value={`${adminAccount.firstName || ''} ${adminAccount.lastName || ''}`.trim() || 'Not provided'}
        />
        <InfoRow icon={Mail} label="Email" value={adminAccount.email || 'Not provided'} />
      </div>

      {/* Instance Configuration */}
      <div className="rounded-lg border border-white/10 bg-[#0e1526] p-6 space-y-1">
        <h3 className="text-lg font-semibold mb-4">Instance Configuration</h3>
        <InfoRow
          icon={Server}
          label="Subdomain"
          value={
            instanceConfiguration.subdomain
              ? `${instanceConfiguration.subdomain}.hub.wundr.space`
              : 'Not provided'
          }
        />
        <InfoRow
          icon={MapPin}
          label="Region"
          value={instanceConfiguration.region || 'Not provided'}
        />
        <InfoRow
          icon={Cpu}
          label="AI Provider"
          value={
            instanceConfiguration.aiProvider
              ? instanceConfiguration.aiProvider === 'ollama'
                ? 'Ollama (Privacy-First)'
                : instanceConfiguration.aiProvider === 'openai'
                  ? 'OpenAI'
                  : 'Anthropic Claude'
              : 'Not provided'
          }
        />
        <InfoRow
          icon={Database}
          label="Storage Size"
          value={instanceConfiguration.storageSize || 'Not provided'}
        />
        <InfoRow
          icon={Shield}
          label="Public Access"
          value={instanceConfiguration.enablePublicAccess ? 'Enabled' : 'Disabled'}
        />
      </div>

      {/* Privacy Notice */}
      {instanceConfiguration.aiProvider === 'ollama' && (
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/5 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-emerald-400">Privacy-First Configuration</h4>
              <p className="text-sm text-slate-300 mt-1">
                Your instance will run AI models locally on your infrastructure. No data will be
                sent to external AI providers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={previousStep}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-medium text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={handleDeploy}
          disabled={isSubmitting || deploymentStatus !== 'idle'}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3 font-medium text-white hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deploymentStatus === 'deploying' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deploying...
            </>
          ) : (
            <>Deploy Knowledge Space</>
          )}
        </button>
      </div>
    </div>
  )
}
