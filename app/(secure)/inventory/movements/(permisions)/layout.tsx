"use client";

import { useEffect } from "react";

import { useUserService } from "_services";

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
	const userService = useUserService();
	const user = userService.currentUser;

	useEffect(() => {
		userService.getCurrent();
	}, []);

	// if not logged in redirect to login page
	if (user?.role === "SUPERADMIN") {
		return (
			<div>
				<div>
					<div>{children}</div>
				</div>
			</div>
		);
	}

	if (user?.role === "ADMIN") {
		return (
			<div>
				<div>
					<div>{children}</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div>
				<div>Cargando... o tal vez no tengas acceso a esta ruta :(</div>
			</div>
		</div>
	);
}
