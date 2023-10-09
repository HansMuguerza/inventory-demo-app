"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useUserService } from "_services";
import { Spinner } from "_components";

export default Home;

function Home() {
	const userService = useUserService();
	const user = userService.currentUser;

	useEffect(() => {
		userService.getCurrent();
	}, []);

	if (user) {
		return (
			<>
				<h1>Bienvenido(a) {user.firstName}!</h1>
				<p>
					<Link href="/users">Control de usuarios</Link>
				</p>
			</>
		);
	} else {
		return <Spinner />;
	}
}
