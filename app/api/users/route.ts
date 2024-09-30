import { usersRepo } from "_helpers/server";

export async function GET(request: Request) {
	const allUsers = await usersRepo.getAll();
	return Response.json(allUsers);
}

export async function POST(request: Request) {
	const body = await request.json();
	const res = usersRepo.create(body);
	return Response.json(res);
}
