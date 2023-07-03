import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { contentValidationSchema } from 'validationSchema/contents';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.content
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getContentById();
    case 'PUT':
      return updateContentById();
    case 'DELETE':
      return deleteContentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getContentById() {
    const data = await prisma.content.findFirst(convertQueryToPrismaUtil(req.query, 'content'));
    return res.status(200).json(data);
  }

  async function updateContentById() {
    await contentValidationSchema.validate(req.body);
    const data = await prisma.content.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteContentById() {
    const data = await prisma.content.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
