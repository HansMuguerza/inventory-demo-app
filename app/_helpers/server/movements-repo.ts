import { db } from "./db";

const Movement = db.Movement;

export const movementsRepo = {
	getAll,
	getById,
	create,
	update,
	delete: softDelete,
};

async function getAll() {
	return await Movement.find({ deletedAt: null });
}

async function getById(id: string) {
	try {
		return await Movement.findById(id);
	} catch {
		throw "Movement Not Found";
	}
}

async function create(params: any) {
	const movement = new Movement(params);

	await movement.save();
}

async function update(id: string, params: any) {
	const movement = await Movement.findById(id);

	// validate
	if (!movement) throw "Movement not found";

	// copy params properties to user
	Object.assign(movement, params);

	await movement.save();
}

async function _delete(id: string) {
	await Movement.findByIdAndRemove(id);
}

async function softDelete(id: string) {
	const movement = await Movement.findById(id);

	// validate
	if (!movement) throw "Movement not found";

	// copy params properties to user
	Object.assign(movement, { deletedAt: Date.now() });

	await movement.save();
}
