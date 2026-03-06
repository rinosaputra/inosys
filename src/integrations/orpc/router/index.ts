import { ORPCError, os } from '@orpc/server'
import * as z from 'zod'

export default {
  ping: os
    .input(z.object({ message: z.string() }))
    .output(z.object({ response: z.string() }))
    .handler(({ input }) => {
      if (input.message === 'error') {
        throw new ORPCError("BAD_REQUEST", {
          message: "This is an error message",
        })
      }
      return { response: `Pong: ${input.message}` }
    }),
}
