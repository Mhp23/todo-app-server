import type {TodoType} from '@/schemas/todo.schema';
import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema<TodoType>(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const TodoModel = mongoose.model<TodoType>('Todo', TodoSchema);
