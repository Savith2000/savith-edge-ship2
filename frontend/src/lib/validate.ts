import { z } from 'zod'

export const TextSchema = z.string().min(1, 'Text is required').max(100, 'Text must be 100 characters or less')
