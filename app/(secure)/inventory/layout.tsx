"use client";

import { useEffect } from "react";
import { useUserService } from "_services";
import { Spinner } from "_components";
import Sidebar from "_components/inventory/Sidebar";
import { Toaster } from "_components/ui/toaster";
import Loading from "_components/Loading";

export default function Layout({ children }: { children: React.ReactNode }) {
	const userService = useUserService();
	const user = userService.currentUser;

	useEffect(() => {
		userService.getCurrent();
	}, []);

	if (user) {
		return (
			<div className="bg-zinc-200 text-zinc-900 relative h-screen overflow-hidden md:flex">
				<Toaster />
				<Sidebar user={user} />
				<div className="flex-1 px-8 py-6 text-2xl font-bold h-full overflow-y-auto">
					{children}
				</div>
			</div>
		);
	}

	return <Loading />;
}
