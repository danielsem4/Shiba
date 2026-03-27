import { Router } from 'express';
import { authenticate } from '../../shared/middlewares/authenticate';
import { StatisticsRepository } from './statistics.repository';
import { StatisticsService } from './statistics.service';
import { createStatisticsController } from './statistics.controller';

const repository = new StatisticsRepository();
const service = new StatisticsService(repository);
const controller = createStatisticsController(service);

export const statisticsRouter = Router();

statisticsRouter.use(authenticate);

statisticsRouter.get('/', controller.getStatistics);
