import { Router } from 'express';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { authenticate } from '../../shared/middlewares/authenticate';
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  moveAssignmentSchema,
  importAssignmentsSchema,
  addStudentSchema,
  importStudentsSchema,
} from './assignment.schema';
import { AssignmentRepository } from './assignment.repository';
import { AssignmentService } from './assignment.service';
import { createAssignmentController } from './assignment.controller';

const repository = new AssignmentRepository();
const service = new AssignmentService(repository);
const controller = createAssignmentController(service);

export const assignmentRouter = Router();

assignmentRouter.use(authenticate);

assignmentRouter.get('/', controller.getByAcademicYear);
assignmentRouter.get('/:id', controller.getById);
assignmentRouter.post('/', validateRequest(createAssignmentSchema), controller.create);
assignmentRouter.patch('/:id', validateRequest(updateAssignmentSchema), controller.update);
assignmentRouter.patch('/:id/move', validateRequest(moveAssignmentSchema), controller.move);
assignmentRouter.delete('/:id', controller.remove);
assignmentRouter.post('/import', validateRequest(importAssignmentsSchema), controller.importAssignments);
assignmentRouter.post('/:id/students', validateRequest(addStudentSchema), controller.addStudent);
assignmentRouter.delete('/:id/students/:studentId', controller.removeStudent);
assignmentRouter.post('/:id/students/import', validateRequest(importStudentsSchema), controller.importStudents);
