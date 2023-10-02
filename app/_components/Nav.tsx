"use client";

import { useState } from "react";

import { NavLink } from "_components";
import { useUserService } from "_services";

import { buttonVariants } from "_components/ui/button";

export { Nav };

function Nav() {
	const [loggingOut, setLoggingOut] = useState<boolean>(false);
	const userService = useUserService();

	async function logout() {
		setLoggingOut(true);
		await userService.logout();
	}

	return (
		<nav className="py-2 px-3">
			<div className="flex justify-between">
				<div className="flex gap-x-2">
					<NavLink
						href="/"
						exact
						className={buttonVariants({ variant: "ghost" })}
					>
						Home
					</NavLink>
					<NavLink
						href="/users"
						className={buttonVariants({ variant: "ghost" })}
					>
						Usuarios
					</NavLink>
					<NavLink
						href="/inventory"
						className={buttonVariants({ variant: "ghost" })}
					>
						Inventario
					</NavLink>
				</div>
				<button
					onClick={logout}
					className={buttonVariants({ variant: "link" })}
					style={{ width: "67px" }}
					disabled={loggingOut}
				>
					{loggingOut ? (
						<span className="spinner-border spinner-border-sm"></span>
					) : (
						<span>Logout</span>
					)}
				</button>
			</div>
		</nav>
	);
}
