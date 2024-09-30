import { movementsRepo } from "_helpers/server";

export async function GET(request: Request, { params: { id } }: any) {
	const movement = await movementsRepo.getById(id);
	return Response.json(movement);
}

export async function PUT(request: Request, { params: { id } }: any) {
	const body = await request.json();
	await movementsRepo.update(id, body);
	return Response.json("updated movement");
}

export async function DELETE(request: Request, { params: { id } }: any) {
	await movementsRepo.delete(id);
	return Response.json("deleted movement");
}
