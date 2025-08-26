import { z } from 'zod'

export const loginSchema = z.object({
  userName: z.string().min(1, 'Nome de usuário é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>