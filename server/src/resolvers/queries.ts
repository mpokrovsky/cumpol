import {
  Collection,
  Domain,
  Maybe,
  QueryGetCollectionsArgs,
  QueryGetDomainArgs,
  QueryResolvers,
  RequireFields,
  ResolverFn,
  ResolverTypeWrapper,
} from '../generated/types';
import { Context } from '../interfaces';

export const getDomains: ResolverFn<Maybe<ResolverTypeWrapper<Domain>>[], {}, any, {}> = (
  _root,
  _args,
  ctx: Context,
) =>
  ctx.prisma.domain.findMany({
    where: { userId: ctx.userId },
    include: {
      collections: {
        include: {
          todoLists: {
            include: {
              todos: true,
            },
          },
        },
      },
    },
  });

export const getDomain: ResolverFn<
  Maybe<ResolverTypeWrapper<Domain>>,
  {},
  any,
  RequireFields<QueryGetDomainArgs, 'domainId'>
> = (_root, args, ctx: Context) =>
  ctx.prisma.domain.findUnique({
    where: { id: args.domainId },
    include: {
      collections: {
        include: {
          todoLists: {
            include: {
              todos: true,
            },
          },
        },
      },
    },
  });

export const getCollections: ResolverFn<
  Maybe<ResolverTypeWrapper<Collection>>[],
  {},
  any,
  RequireFields<QueryGetCollectionsArgs, 'domainId'>
> = (_root, args, ctx: Context) =>
  ctx.prisma.collection.findMany({
    where: { domainId: args.domainId },
    include: {
      todoLists: {
        include: {
          todos: true,
        },
      },
    },
  });

const Query: QueryResolvers<any, {}> = {
  getDomains: {
    resolve: getDomains,
  },
  getDomain: {
    resolve: getDomain,
  },
  getCollections: {
    resolve: getCollections,
  },
};

export default Query;