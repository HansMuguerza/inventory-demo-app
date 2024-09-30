import { itemsRepo } from "_helpers/server";

export async function GET(request: Request, { params: { id } }: any) {
	const item = await itemsRepo.getById(id);
	return Response.json(item);
}

export async function PUT(request: Request, { params: { id } }: any) {
	const body = await request.json();
	await itemsRepo.update(id, body);
	return Response.json("updated item");
}

export async function DELETE(request: Request, { params: { id } }: any) {
	await itemsRepo.delete(id);
	return Response.json("deleted item");
}
