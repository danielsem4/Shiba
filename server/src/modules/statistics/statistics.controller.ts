import type { Request, Response, NextFunction } from 'express';
import type { StatisticsService } from './statistics.service';

export function createStatisticsController(service: StatisticsService) {
  return {
    async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const academicYearId = Number(req.query.academicYearId);
        if (!academicYearId || isNaN(academicYearId)) {
          res.status(400).json({ message: 'academicYearId query parameter is required' });
          return;
        }

        const timeframe = req.query.timeframe as string;
        if (!timeframe || !['weekly', 'yearly'].includes(timeframe)) {
          res.status(400).json({ message: 'timeframe must be "weekly" or "yearly"' });
          return;
        }

        let weekStart: string | undefined;
        let weekEnd: string | undefined;

        if (timeframe === 'weekly') {
          if (!req.query.weekStart || !req.query.weekEnd) {
            res.status(400).json({ message: 'weekStart and weekEnd are required for weekly timeframe' });
            return;
          }
          weekStart = req.query.weekStart as string;
          weekEnd = req.query.weekEnd as string;
        }

        const data = await service.getStatistics(
          academicYearId,
          timeframe as 'weekly' | 'yearly',
          weekStart,
          weekEnd,
        );
        res.json(data);
      } catch (err) {
        next(err);
      }
    },
  };
}
