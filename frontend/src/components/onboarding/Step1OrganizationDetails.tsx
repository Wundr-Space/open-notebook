'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  organizationDetailsSchema,
  type OrganizationDetailsForm,
} from '@/lib/validations/onboarding'
import { useOnboardingStore } from '@/lib/stores/onboarding-store'
import { Building2, Globe, FileText } from 'lucide-react'

export function Step1OrganizationDetails() {
  const { organizationDetails, updateOrganizationDetails, nextStep } = useOnboardingStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationDetailsForm>({
    resolver: zodResolver(organizationDetailsSchema),
    defaultValues: organizationDetails,
  })

  const onSubmit = (data: OrganizationDetailsForm) => {
    updateOrganizationDetails(data)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Organization Details</h2>
        <p className="text-slate-400">
          Tell us about your organization to get started with your Knowledge Space.
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Name */}
        <div className="space-y-2">
          <label htmlFor="organizationName" className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="h-4 w-4 text-emerald-400" />
            Organization Name
          </label>
          <input
            id="organizationName"
            type="text"
            placeholder="Acme Corporation"
            {...register('organizationName')}
            className="w-full rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
          />
          {errors.organizationName && (
            <p className="text-sm text-red-400">{errors.organizationName.message}</p>
          )}
        </div>

        {/* Domain */}
        <div className="space-y-2">
          <label htmlFor="domain" className="flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4 text-emerald-400" />
            Organization Domain
          </label>
          <input
            id="domain"
            type="text"
            placeholder="acme.com"
            {...register('domain')}
            className="w-full rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
          />
          {errors.domain && <p className="text-sm text-red-400">{errors.domain.message}</p>}
          <p className="text-xs text-slate-500">
            This will be used for email verification and SSO configuration.
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4 text-emerald-400" />
            Organization Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Tell us about your organization, what you do, and how you plan to use your Knowledge Space..."
            {...register('description')}
            className="w-full rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all resize-none"
          />
          {errors.description && (
            <p className="text-sm text-red-400">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
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
