import { z } from 'zod'

export const organizationDetailsSchema = z.object({
  organizationName: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters'),
  domain: z
    .string()
    .min(3, 'Domain must be at least 3 characters')
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
      'Please enter a valid domain (e.g., example.com)'
    ),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
})

export const adminAccountSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters'),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const instanceConfigurationSchema = z.object({
  subdomain: z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(63, 'Subdomain must be less than 63 characters')
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      'Subdomain can only contain lowercase letters, numbers, and hyphens'
    ),
  region: z.string().min(1, 'Please select a region'),
  aiProvider: z.enum(['ollama', 'openai', 'anthropic'], {
    required_error: 'Please select an AI provider',
  }),
  enablePublicAccess: z.boolean(),
  storageSize: z.string().min(1, 'Please select a storage size'),
})

export type OrganizationDetailsForm = z.infer<typeof organizationDetailsSchema>
export type AdminAccountForm = z.infer<typeof adminAccountSchema>
export type InstanceConfigurationForm = z.infer<typeof instanceConfigurationSchema>
