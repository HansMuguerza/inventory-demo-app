import joi from "joi";

import { movementsRepo } from "_helpers/server";
import { apiHandler } from "_helpers/server/api";

module.exports = apiHandler({
	GET: getAll,
	POST: create,
});

async function getAll() {
	return await movementsRepo.getAll();
}

async function create(req: Request) {
	const body = await req.json();
	await movementsRepo.create(body);
}

create.schema = joi.object({
	itemId: joi.string().required(),
	type: joi.string().required(),
	date: joi.date(),
	staffId: joi.string().required(),
	userId: joi.string().required(),
	amount: joi.number().required(),
	reason: joi.string().required(),
	obs: joi.optional(),
});
