import { db } from "./db";

const Movement = db.Movement;
const Item = db.Item;
const User = db.User;

export const movementsRepo = {
	getAll,
	getById,
	create,
	update,
	delete: softDelete,
};

async function getAll() {
	try {
		// return await Movement.find({ deletedAt: null });
		const movements = await Movement.find({ deletedAt: null });
		// Obtener los IDs de los elementos relacionados
		const itemIds = movements.map((movement) => movement.itemId);
		const staffIds = movements.map((movement) => movement.staffId);
		const userIds = movements.map((movement) => movement.userId);

		// Consultar los elementos relacionados
		const items = await Item.find({ _id: { $in: itemIds } });
		const staffs = await User.find({ _id: { $in: staffIds } });
		const users = await User.find({ _id: { $in: userIds } });

		// Asignar los elementos relacionados a los documentos de movimiento
		const populatedMovements = movements.map((movement) => {
			const item = items.find(
				(item) => item._id.toString() === movement.itemId.toString()
			);
			const staff = staffs.find(
				(staff) => staff._id.toString() === movement.staffId.toString()
			);
			const user = users.find(
				(user) => user._id.toString() === movement.userId.toString()
			);
			return {
				...movement.toObject(), // Convertir el documento Mongoose a un objeto plano
				Item: item, // Reemplazar la referencia por el objeto relacionado
				Staff: staff, // Reemplazar la referencia por el objeto relacionado
				User: user, // Reemplazar la referencia por el objeto relacionado
			};
		});

		return populatedMovements;
	} catch (error) {
		throw "Error en movements-repo";
	}
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
