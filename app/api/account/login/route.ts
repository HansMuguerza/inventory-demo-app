import { cookies } from "next/headers";
import { usersRepo } from "_helpers/server";

export async function POST(request: Request) {
	const body = await request.json();
	const { user, token } = await usersRepo.authenticate(body);

	// return jwt token in http only cookie
	cookies().set("authorization", token, { httpOnly: true });
	cookies().set("userId", user.id, { httpOnly: true });

	return Response.json(user);
}
