import type { Visit } from '@/core/domain/entities/Visit.entity.ts'

export interface VisitRepositoryPort {
	save(visit: Visit): Promise<void>
}
