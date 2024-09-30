import { itemsRepo } from "_helpers/server";

export async function GET(request: Request) {
	const allItems = await itemsRepo.getAll();
	return Response.json(allItems);
}

export async function POST(request: Request) {
	const body = await request.json();
	const res = itemsRepo.create(body);
	return Response.json(res);
}
