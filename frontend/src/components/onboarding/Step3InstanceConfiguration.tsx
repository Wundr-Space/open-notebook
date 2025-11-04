'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  instanceConfigurationSchema,
  type InstanceConfigurationForm,
} from '@/lib/validations/onboarding'
import { useOnboardingStore } from '@/lib/stores/onboarding-store'
import { Server, MapPin, Database, ArrowLeft, Shield, Cpu } from 'lucide-react'

export function Step3InstanceConfiguration() {
  const { instanceConfiguration, updateInstanceConfiguration, nextStep, previousStep } =
    useOnboardingStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InstanceConfigurationForm>({
    resolver: zodResolver(instanceConfigurationSchema),
    defaultValues: instanceConfiguration,
  })

  const selectedAiProvider = watch('aiProvider')

  const onSubmit = (data: InstanceConfigurationForm) => {
    updateInstanceConfiguration(data)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Instance Configuration</h2>
        <p className="text-slate-400">
          Configure your Knowledge Space deployment preferences and technical settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Subdomain */}
        <div className="space-y-2">
          <label htmlFor="subdomain" className="flex items-center gap-2 text-sm font-medium">
            <Server className="h-4 w-4 text-emerald-400" />
            Subdomain
          </label>
          <div className="flex items-center gap-2">
            <input
              id="subdomain"
              type="text"
              placeholder="your-org"
              {...register('subdomain')}
              className="flex-1 rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
            />
            <span className="text-slate-400">.hub.wundr.space</span>
          </div>
          {errors.subdomain && <p className="text-sm text-red-400">{errors.subdomain.message}</p>}
          <p className="text-xs text-slate-500">
            Choose a unique subdomain for your Knowledge Space.
          </p>
        </div>

        {/* Region */}
        <div className="space-y-2">
          <label htmlFor="region" className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-emerald-400" />
            Deployment Region
          </label>
          <select
            id="region"
            {...register('region')}
            className="w-full rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
          >
            <option value="us-central1">US Central (Iowa)</option>
            <option value="us-east1">US East (South Carolina)</option>
            <option value="us-west1">US West (Oregon)</option>
            <option value="europe-west1">Europe West (Belgium)</option>
            <option value="europe-west2">Europe West (London)</option>
            <option value="asia-east1">Asia East (Taiwan)</option>
            <option value="asia-northeast1">Asia Northeast (Tokyo)</option>
          </select>
          {errors.region && <p className="text-sm text-red-400">{errors.region.message}</p>}
          <p className="text-xs text-slate-500">Choose the region closest to your team.</p>
        </div>

        {/* AI Provider */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Cpu className="h-4 w-4 text-emerald-400" />
            AI Provider
          </label>
          <div className="space-y-3">
            {/* Ollama */}
            <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-[#0e1526] p-4 cursor-pointer hover:border-emerald-400/50 transition-all">
              <input
                type="radio"
                value="ollama"
                {...register('aiProvider')}
                className="mt-1 text-emerald-500 focus:ring-emerald-400"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Ollama (Recommended)</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                    Privacy-First
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Run AI models locally on your infrastructure. Complete data privacy and no API
                  costs.
                </p>
              </div>
            </label>

            {/* OpenAI */}
            <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-[#0e1526] p-4 cursor-pointer hover:border-emerald-400/50 transition-all">
              <input
                type="radio"
                value="openai"
                {...register('aiProvider')}
                className="mt-1 text-emerald-500 focus:ring-emerald-400"
              />
              <div className="flex-1">
                <span className="font-medium">OpenAI</span>
                <p className="text-sm text-slate-400 mt-1">
                  GPT-4 and GPT-3.5 models. Requires API key and usage-based billing.
                </p>
              </div>
            </label>

            {/* Anthropic */}
            <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-[#0e1526] p-4 cursor-pointer hover:border-emerald-400/50 transition-all">
              <input
                type="radio"
                value="anthropic"
                {...register('aiProvider')}
                className="mt-1 text-emerald-500 focus:ring-emerald-400"
              />
              <div className="flex-1">
                <span className="font-medium">Anthropic Claude</span>
                <p className="text-sm text-slate-400 mt-1">
                  Claude 3 models. Requires API key and usage-based billing.
                </p>
              </div>
            </label>
          </div>
          {errors.aiProvider && <p className="text-sm text-red-400">{errors.aiProvider.message}</p>}
        </div>

        {/* Storage Size */}
        <div className="space-y-2">
          <label htmlFor="storageSize" className="flex items-center gap-2 text-sm font-medium">
            <Database className="h-4 w-4 text-emerald-400" />
            Storage Size
          </label>
          <select
            id="storageSize"
            {...register('storageSize')}
            className="w-full rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
          >
            <option value="10GB">10 GB (Starter)</option>
            <option value="50GB">50 GB (Professional)</option>
            <option value="100GB">100 GB (Business)</option>
            <option value="500GB">500 GB (Enterprise)</option>
          </select>
          {errors.storageSize && (
            <p className="text-sm text-red-400">{errors.storageSize.message}</p>
          )}
        </div>

        {/* Public Access */}
        <div className="space-y-2">
          <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-[#0e1526] p-4 cursor-pointer">
            <input
              type="checkbox"
              {...register('enablePublicAccess')}
              className="mt-1 text-emerald-500 focus:ring-emerald-400 rounded"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="font-medium">Enable Public Access</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Allow anonymous users to view published notebooks. You can always change this later.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={previousStep}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-medium text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-medium text-white hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
        >
          Continue
        </button>
      </div>
    </form>
  )
}
