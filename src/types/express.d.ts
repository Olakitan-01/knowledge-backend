import { User } from '../auth/schema/user.schema';

declare global {
  namespace Express {
    interface Request {
      user: User & { _id: string };
    }
  }
}
