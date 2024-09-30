import { cookies } from "next/headers";

export async function POST(request: Request) {
	cookies().delete("authorization");
	cookies().delete("userId");
	return Response.json("logout");
}
