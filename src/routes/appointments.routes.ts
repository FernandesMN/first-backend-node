import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import ensureAutheticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAutheticated);

appointmentsRouter.get('/', async (request, response) => {
	const appointmentsRepository = getCustomRepository(AppointmentsRepository);
	const appointments = await appointmentsRepository.find();

	return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
	try {
		const { provider_id, date } = request.body;

		const parsedDate = parseISO(date);

		const createAppointment = new CreateAppointmentService();

		const appointment = await createAppointment.execute({
			date: parsedDate,
			provider_id
		});

		return response.json(appointment);
	} catch (err) {
		return response.status(400).json({ error: err.message });
	}
});

export default appointmentsRouter;
