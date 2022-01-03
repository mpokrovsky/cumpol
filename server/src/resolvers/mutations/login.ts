import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  AuthPayload,
  Maybe,
  MutationLoginArgs,
  RequireFields,
  ResolverFn,
  ResolverTypeWrapper,
} from '../../generated/types';
import { Context } from '../../interfaces';
import { APP_SECRET } from '../../utils';

const login: ResolverFn<
  ResolverTypeWrapper<AuthPayload>,
  {},
  Context,
  RequireFields<MutationLoginArgs, 'password' | 'username'>
> = async (_root, args, context) => {
  const user = await context.prisma.user.findUnique({
    where: { username: args.username },
    include: {
      spaces: {
        include: {
          topics: {
            include: {
              todoLists: {
                include: {
                  todos: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return {
      token: null,
      user: null,
      error: 'No user found',
    };
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    return {
      token: null,
      user: null,
      error: 'Invalid password',
    };
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

export default login;
