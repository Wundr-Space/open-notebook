'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminAccountSchema, type AdminAccountForm } from '@/lib/validations/onboarding'
import { useOnboardingStore } from '@/lib/stores/onboarding-store'
import { User, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export function Step2AdminAccount() {
  const { adminAccount, updateAdminAccount, nextStep, previousStep } = useOnboardingStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminAccountForm>({
    resolver: zodResolver(adminAccountSchema),
    defaultValues: adminAccount,
  })

  const onSubmit = (data: AdminAccountForm) => {
    updateAdminAccount(data)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Admin Account</h2>
        <p className="text-slate-400">
          Create your administrator account. You&apos;ll use this to manage your Knowledge Space.
        </p>
      </div>

      <div className="space-y-6">
        {/* First Name */}
        <div className="space-y-2">
          <label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-emerald-400" />
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="John"
            {...register('firstName')}
            className="w-full rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
          />
          {errors.firstName && <p className="text-sm text-red-400">{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-emerald-400" />
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Doe"
            {...register('lastName')}
            className="w-full rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
          />
          {errors.lastName && <p className="text-sm text-red-400">{errors.lastName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4 text-emerald-400" />
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="john.doe@acme.com"
            {...register('email')}
            className="w-full rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
          />
          {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
            <Lock className="h-4 w-4 text-emerald-400" />
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className="w-full rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
          <p className="text-xs text-slate-500">
            Must be at least 8 characters with uppercase, lowercase, and numbers.
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
            <Lock className="h-4 w-4 text-emerald-400" />
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('confirmPassword')}
            className="w-full rounded-lg border border-white/10 bg-[#0e1526] px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
          )}
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
