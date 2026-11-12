import { z } from 'zod'
import { api, TOKEN_KEY } from '../api/client'
import {
  userSchema, type LoginInput, type CandidateRegisterInput, type CompanyRegisterInput, type ForgotPasswordInput, type User,
} from '../../schemas/auth'

const sessionSchema = z.object({ token: z.string(), user: userSchema })

// PROPOSTA de contrato — ver docs/API.md. Senhas nunca são guardadas no frontend.
export const authService = {
  async login(input: LoginInput): Promise<User> {
    const { data } = await api.post('/auth/login', input)
    const s = sessionSchema.parse(data)
    localStorage.setItem(TOKEN_KEY, s.token)
    return s.user
  },
  async registerCandidate(input: CandidateRegisterInput): Promise<void> {
    const { confirmPassword: _c, acceptTerms: _a, ...body } = input
    await api.post('/auth/register/candidate', body)
  },
  async registerCompany(input: CompanyRegisterInput): Promise<void> {
    const { confirmPassword: _c, acceptTerms: _a, ...body } = input
    await api.post('/auth/register/company', body)
  },
  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await api.post('/auth/forgot-password', input)
  },
  async me(): Promise<User> {
    const { data } = await api.get('/auth/me')
    return userSchema.parse(data)
  },
  hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY)
  },
  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
  },
}
