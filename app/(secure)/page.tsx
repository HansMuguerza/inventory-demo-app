"use client";

import { useEffect, useState } from "react";

import { useUserService } from "_services";
import { Spinner } from "_components";
import Link from "next/link";
import { Button } from "_components/new-ui";
import { Loader, LogOut } from "lucide-react";

export default function Home() {
	const [loggingOut, setLoggingOut] = useState<boolean>(false);

	const userService = useUserService();
	const user = userService.currentUser;

	async function logout() {
		setLoggingOut(true);
		await userService.logout();
	}

	useEffect(() => {
		userService.getCurrent();
	}, [userService]);

	if (user) {
		return (
			<div className="flex flex-col items-center gap-y-2 pt-40">
				<h1 className="text-xl font-semibold">
					Hola, {user.firstName}
				</h1>
				<div className="flex gap-x-4 mb-24">
					<Link href="/inventory">
						<Button>Inventario</Button>
					</Link>
				</div>
				<button onClick={logout} disabled={loggingOut}>
					{loggingOut ? (
						<div className="flex items-center gap-x-1">
							<Loader className="h-3 w-3 animate-spin" />
							<span className="text-sm font-medium">
								Cerrando Sesión...
							</span>
						</div>
					) : (
						<div className="flex items-center gap-x-1">
							<LogOut className="h-3 w-3" />
							<span className="text-sm font-medium">
								Cerrar Sesión
							</span>
						</div>
					)}
				</button>
			</div>
		);
	} else {
		return <Spinner />;
	}
}
