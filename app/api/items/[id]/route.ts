import joi from "joi";

import { apiHandler } from "_helpers/server/api";
import { itemsRepo } from "_helpers/server";

module.exports = apiHandler({
	GET: getById,
	PUT: update,
	DELETE: _delete,
});

async function getById(req: Request, { params: { id } }: any) {
	return await itemsRepo.getById(id);
}

async function update(req: Request, { params: { id } }: any) {
	const body = await req.json();
	await itemsRepo.update(id, body);
}

update.schema = joi.object({
	description: joi.string().required(),
	category: joi.string().required(),
	model: joi.optional(),
	brand: joi.optional(),
	serie: joi.optional(),
	undMed: joi.string().required(),
	minStock: joi.number().required(),
	important: joi.boolean(),
	state: joi.optional(),
});

async function _delete(req: Request, { params: { id } }: any) {
	await itemsRepo.delete(id);
}
