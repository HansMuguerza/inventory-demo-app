import joi from "joi";

import { itemsRepo } from "_helpers/server";
import { apiHandler } from "_helpers/server/api";

module.exports = apiHandler({
	GET: getAll,
	POST: create,
});

async function getAll() {
	return await itemsRepo.getAll();
}

async function create(req: Request) {
	const body = await req.json();
	await itemsRepo.create(body);
}

create.schema = joi.object({
	description: joi.string().required(),
	category: joi.string().required(),
	model: joi.string(),
	brand: joi.string(),
	undMed: joi.string().required(),
	minStock: joi.number().required(),
	important: joi.boolean(),
	state: joi.string(),
});
