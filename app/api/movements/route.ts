import { movementsRepo } from "_helpers/server";

export async function GET(request: Request) {
	const allMovements = await movementsRepo.getAll();
	return Response.json(allMovements);
}

export async function POST(request: Request) {
	const body = await request.json();
	const res = movementsRepo.create(body);
	return Response.json(res);
}
