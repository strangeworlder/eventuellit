import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../db/db.module';
import { characters } from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CharactersService {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    ) { }

    async findAll() {
        return this.db.query.characters.findMany();
    }

    async findOne(id: number) {
        return this.db.query.characters.findFirst({
            where: eq(characters.id, id),
        });
    }

    async create(data: typeof characters.$inferInsert) {
        const result = await this.db.insert(characters).values(data).returning();
        return result[0];
    }

    async update(id: number, data: Partial<typeof characters.$inferInsert>) {
        const result = await this.db
            .update(characters)
            .set(data)
            .where(eq(characters.id, id))
            .returning();
        return result[0];
    }

    async remove(id: number) {
        await this.db.delete(characters).where(eq(characters.id, id));
    }
}
