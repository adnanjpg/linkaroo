import { PrismaClient } from '@prisma/client'
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next/dist/shared/lib/utils'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const linkId = req.query.linkid as string

  const linkRecord = await prisma.createdLink.findFirst({
    where: {
      link_id: linkId,
    },
  })

  if (!linkRecord) return res.status(404).json({ error: 'Link not found' })

  // redirect to the link
  res.redirect(linkRecord.points_to)

  //   res.status(200).json({ name: 'John Doe' })
}
