import joi from "joi";

import { apiHandler } from "_helpers/server/api";
import { movementsRepo } from "_helpers/server";

module.exports = apiHandler({
	GET: getById,
	PUT: update,
	DELETE: _delete,
});

async function getById(req: Request, { params: { id } }: any) {
	return await movementsRepo.getById(id);
}

async function update(req: Request, { params: { id } }: any) {
	const body = await req.json();
	await movementsRepo.update(id, body);
}

update.schema = joi.object({
	itemId: joi.string().required(),
	type: joi.string().required(),
	date: joi.date(),
	staffId: joi.string().required(),
	amount: joi.number().required(),
	reason: joi.string().required(),
	obs: joi.optional(),
});

async function _delete(req: Request, { params: { id } }: any) {
	await movementsRepo.delete(id);
}
