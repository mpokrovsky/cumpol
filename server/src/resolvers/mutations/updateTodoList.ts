import { ForbiddenError } from 'apollo-server-express';
import {
  MutationUpdateTodoListArgs,
  RequireFields,
  ResolverFn,
  ResolverTypeWrapper,
  TodoList,
} from '../../generated/types';
import { Context } from '../../interfaces';

const updateTodoList: ResolverFn<
  ResolverTypeWrapper<TodoList>,
  {},
  Context,
  RequireFields<MutationUpdateTodoListArgs, 'title' | 'todoListId'>
> = (_root, args, context) => {
  if (!context.userId) throw new ForbiddenError('you must be logged in');

  return context.prisma.todoList.update({
    where: {
      id: args.todoListId,
    },
    data: { title: args.title },
    include: {
      todos: true,
    },
  });
};

export default updateTodoList;