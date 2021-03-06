import { ForbiddenError } from 'apollo-server-express';

import {
  MutationUpdateCheckListArgs,
  Payload,
  RequireFields,
  ResolverFn,
  ResolverTypeWrapper,
} from '../../generated/types';
import { Context } from '../../interfaces';

const updateCheckList: ResolverFn<
  ResolverTypeWrapper<Payload>,
  {},
  Context,
  RequireFields<MutationUpdateCheckListArgs, 'title' | 'checkListId' | 'topicId'>
> = async (_root, args, { userId, prisma, pubsub }) => {
  if (!userId) throw new ForbiddenError('you must be logged in');

  const updatedCheckLists = await prisma.topic
    .update({
      where: { id: args.topicId },
      data: {
        checkLists: {
          update: {
            where: {
              id: args.checkListId,
            },
            data: { title: args.title },
          },
        },
      },
    })
    .checkLists({ select: { id: true }, orderBy: { createdAt: 'asc' } });
  pubsub.publish('checkListsIdsUpdated', {
    checkListsIds: updatedCheckLists.map(({ id }) => id),
    topicId: args.topicId,
  });

  return { success: !!updatedCheckLists, error: null };
};

export default updateCheckList;
