"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "_components/ui/button";
import { useUserService } from "_services";
import { NavLink, Spinner, Title } from "_components";
import { Tabs, TabsList, TabsTrigger } from "_components/ui/tabs";

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
	const userService = useUserService();
	const user = userService.currentUser;

	useEffect(() => {
		userService.getCurrent();
	}, []);

	if (user) {
		return (
			<div className="flex flex-col gap-y-4">
				<div className="flex gap-3">
					<Title>Inventario</Title>
					<div>
						<div>
							<div className="rounded-md flex flex-row gap-x-4 py-2 px-2 text-sm">
								<NavLink href="/inventory/items">Items</NavLink>
								<NavLink href="/inventory/movements">
									Movimientos
								</NavLink>
							</div>
						</div>
					</div>
				</div>

				<div>
					<div>{children}</div>
				</div>
			</div>
		);
	}

	return <Spinner />;
}
