"use client";

import { useEffect, useState } from "react";

import { NavLink } from "_components";
import { useUserService } from "_services";

import { buttonVariants } from "_components/ui/button";
import { LogOut } from "lucide-react";

export { Nav };

function Nav() {
	const [loggingOut, setLoggingOut] = useState<boolean>(false);
	const userService = useUserService();
	const user = userService.currentUser;

	async function logout() {
		setLoggingOut(true);
		await userService.logout();
	}

	useEffect(() => {
		userService.getCurrent();
	}, []);

	if (user?.role === "SUPERADMIN") {
		return (
			<nav className="py-3 px-4 border-b border-neutral-800 fixed h-[70px] w-full bg-neutral-950 flex items-center z-50">
				<div className="w-full flex justify-between">
					<div className="flex gap-x-5 items-center">
						<div className="font-bold">v0.3</div>
						<NavLink href="/" exact>
							Inicio
						</NavLink>
						<NavLink href="/inventory">Inventario</NavLink>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-3">
							<div className="rounded-full bg-neutral-600/40 p-1 px-2.5 font-semibold">
								{user?.firstName[0]}
							</div>
							<div>
								<h2 className="text-sm">
									{user?.firstName.split(" ")[0] +
										" " +
										user?.lastName.split(" ")[0]}
								</h2>
								<p className="text-xs font-medium text-neutral-500">
									{user.role}
								</p>
							</div>
						</div>
						{/* <div className="w-[1px] h-6 bg-neutral-600" /> */}
						<button
							onClick={logout}
							className={buttonVariants({ variant: "link" })}
							disabled={loggingOut}
						>
							{loggingOut ? (
								<span className="spinner-border spinner-border-sm">
									Cerrando Sesión...
								</span>
							) : (
								<div className="flex items-center gap-x-2">
									<LogOut className="h-3 w-3" />
									<span className="text-xs">
										Cerrar Sesión
									</span>
								</div>
							)}
						</button>
					</div>
				</div>
			</nav>
		);
	}

	if (user?.role === "ADMIN") {
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
							href="/inventory"
							className={buttonVariants({ variant: "ghost" })}
						>
							Inventario
						</NavLink>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<div className="rounded-full bg-neutral-600/40 p-1 px-2.5 font-semibold">
								{user?.firstName[0]}
							</div>
							<h2>
								{user?.firstName.split(" ")[0] +
									" " +
									user?.lastName.split(" ")[0]}
							</h2>
						</div>
						<button
							onClick={logout}
							className={buttonVariants({ variant: "link" })}
							disabled={loggingOut}
						>
							{loggingOut ? (
								<span className="spinner-border spinner-border-sm">
									loading
								</span>
							) : (
								<div className="flex items-center gap-x-2">
									<LogOut className="h-4 w-4" />
									<span>Cerrar Sesión</span>
								</div>
							)}
						</button>
					</div>
				</div>
			</nav>
		);
	}

	return <nav className="py-2 px-3"></nav>;
}
