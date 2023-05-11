import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const linksRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ points_to: z.string() }))
    // .mutation(async ({ input, ctx }) => {
    .mutation(async ({ input, ctx }) => {
      //

      // add a `CreatedLink` to the db using prisma
      // return the `CreatedLink` object

      // a 5 character random string including numbers and small letters
      const linkId = Math.random().toString(36).substring(2, 7)

      const link = {
        points_to: input.points_to,
        created_at: new Date(),
        link_id: linkId,
      }

      // add the link to the db

      await ctx.prisma.createdLink.create({
        data: link,
      })

      return link
    }),
})
