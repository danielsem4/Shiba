import type { Request, Response, NextFunction } from 'express';
import type { AuthService } from './auth.service';
import type { LoginDto } from './auth.schema';

export function createAuthController(service: AuthService) {
  return {
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const result = await service.login(req.body as LoginDto);
        res.json(result);
      } catch (err) {
        next(err);
      }
    },
  };
}
