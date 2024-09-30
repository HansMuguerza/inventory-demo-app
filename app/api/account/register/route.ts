import { usersRepo } from "_helpers/server";

export async function POST(request: Request) {
	const body = await request.json();
	const res = usersRepo.create(body);
	return Response.json(res);
}
