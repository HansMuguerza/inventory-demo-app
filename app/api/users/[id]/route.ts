import { cookies } from "next/headers";
import { usersRepo } from "_helpers/server";

export async function GET(request: Request, { params: { id } }: any) {
	const user = await usersRepo.getById(id);
	return Response.json(user);
}

export async function PUT(request: Request, { params: { id } }: any) {
	const body = await request.json();
	await usersRepo.update(id, body);
	return Response.json("updated item");
}

export async function DELETE(request: Request, { params: { id } }: any) {
	await usersRepo.delete(id);

	// auto logout if deleted self
	if (id === cookies().get("userId")) {
		cookies().delete("authorization");
		return Response.json({ deletedSelf: true });
	}

	return Response.json("deleted item");
}
