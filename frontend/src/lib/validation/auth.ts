import { z } from 'zod'

// Common primitives
export const emailSchema = z
  .string({ required_error: 'Adresse email requise.' })
  .trim()
  .email({ message: 'Adresse email invalide.' })

export const passwordSchema = z
  .string({ required_error: 'Mot de passe requis.' })
  .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })

export const phoneSchema = z
  .string({ required_error: 'Numéro de téléphone requis.' })
  .trim()
  .regex(/^\+?[0-9\s-]{7,15}$/, {
    message: 'Veuillez saisir un numéro valide (ex: +243 900 000 000).',
  })

export const nonEmptyString = (label: string, min = 1) =>
  z.string({ required_error: `${label} requis.` }).min(min, { message: `${label} requis.` })

// Signin schema
export const SigninSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type SigninInput = z.infer<typeof SigninSchema>

// Signup schema
export const SignupSchema = z.object({
  name: nonEmptyString('Nom', 2),
  email: emailSchema,
  password: passwordSchema,
  organization: nonEmptyString('Organisation / Hôpital', 2),
  position: nonEmptyString('Poste / Fonction', 2),
  establishmentType: nonEmptyString("Type d'établissement", 2),
  phone: phoneSchema,
  // isDemoRequest is optional on client, enforced server-side when applicable
  isDemoRequest: z.boolean().optional(),
})

export type SignupInput = z.infer<typeof SignupSchema>

// Helpers to return a flat error map usable in forms
export function validateSignin(values: unknown): {
  success: boolean
  data?: SigninInput
  errors?: Record<string, string>
} {
  const parsed = SigninSchema.safeParse(values)
  if (parsed.success) return { success: true, data: parsed.data }
  return { success: false, errors: toErrorMap(parsed.error) }
}

export function validateSignup(values: unknown): {
  success: boolean
  data?: SignupInput
  errors?: Record<string, string>
} {
  const parsed = SignupSchema.safeParse(values)
  if (parsed.success) return { success: true, data: parsed.data }
  return { success: false, errors: toErrorMap(parsed.error) }
}

function toErrorMap(error: z.ZodError): Record<string, string> {
  const map: Record<string, string> = {}
  for (const issue of error.issues) {
    const field = issue.path?.[0]
    if (typeof field === 'string' && !map[field]) {
      map[field] = issue.message
    }
  }
  // Fallback generic error if none mapped
  if (Object.keys(map).length === 0) {
    map.form = 'Certaines données sont invalides. Veuillez vérifier le formulaire.'
  }
  return map
}
