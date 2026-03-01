import { describe, it, expect, afterAll } from 'vitest'
import knex from '.'

describe('db connection', () => {
  afterAll(async () => {
    await knex.destroy()
  })

  it('can connect and run SELECT 1', async () => {
    const result = await knex.raw('SELECT 1 as ok')
    expect(result).toBeTruthy()
  })
})
