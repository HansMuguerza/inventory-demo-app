import { usersRepo } from "_helpers/server";

export async function GET(request: Request) {
	try {
		const currentUser = await usersRepo.getCurrent();
		return Response.json(currentUser);
	} catch (error) {
		console.error("Error:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
