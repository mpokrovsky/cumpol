import { ForbiddenError } from 'apollo-server-express';

import {
  MutationAddTopicArgs,
  Payload,
  RequireFields,
  ResolverFn,
  ResolverTypeWrapper,
} from '../../generated/types';
import { Context } from '../../interfaces';

const addTopic: ResolverFn<
  ResolverTypeWrapper<Payload>,
  {},
  Context,
  RequireFields<MutationAddTopicArgs, 'spaceId' | 'title'>
> = async (_root, args, context) => {
  if (!context.userId) throw new ForbiddenError('you must be logged in');

  const addedTopic = await context.prisma.topic.create({
    data: { title: args.title, space: { connect: { id: args.spaceId } } },
  });

  const updatedTopics = await context.prisma.space
    .findUnique({
      where: { id: args.spaceId },
    })
    .topics({ orderBy: { createdAt: 'asc' } });
  context.pubsub.publish('topicsUpdated', updatedTopics);

  return { success: !!addedTopic, error: null };
};

export default addTopic;
