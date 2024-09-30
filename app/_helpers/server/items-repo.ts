import { db } from "./db";

const Item = db.Item;

export const itemsRepo = {
	getAll,
	getById,
	create,
	update,
	delete: softDelete,
};

async function getAll() {
	return await Item.find({ deletedAt: null }).sort({
		important: -1,
		description: 1,
	});
}

async function getById(id: string) {
	try {
		return await Item.findById(id);
	} catch {
		throw "Item Not Found";
	}
}

async function create(params: any) {
	const item = new Item(params);

	await item.save();
}

async function update(id: string, params: any) {
	const item = await Item.findById(id);

	// validate
	if (!item) throw "Item not found";

	// copy params properties to user
	Object.assign(item, params);

	await item.save();
}

async function _delete(id: string) {
	await Item.findByIdAndRemove(id);
}

async function softDelete(id: string) {
	const item = await Item.findById(id);

	// validate
	if (!item) throw "Item not found";

	// copy params properties to user
	Object.assign(item, { deletedAt: Date.now() });

	await item.save();
}
