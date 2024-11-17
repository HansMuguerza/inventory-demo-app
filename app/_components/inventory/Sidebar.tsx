import Link from "next/link";
import NavLink from "../NewNavLink";
import { ArrowDown, ArrowDownUp, ArrowUp, Home, Package } from "lucide-react";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "_components/new-ui/Dialog";
import EgressForm from "_components/movements/EgressForm";

interface Props {
	user: {
		role: string;
		firstName: string;
		lastName: string;
	};
}

export default function Sidebar({ user }: Props) {
	return (
		<aside className="bg-zinc-300 text-blue-100 border-r border-zinc-400 w-60 space-y-6 py-7 px-4 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
			<div className="h-full flex flex-col justify-between">
				<div className="flex flex-col gap-y-2">
					<Link href="/">
						{/* <Image
							src="/logo.ico"
							alt="TVCAPECE"
							width={35}
							height={35}
						/> */}
						<Image
							src="/logo-dija-n.svg"
							alt="DIJA"
							width={75}
							height={35}
						/>
					</Link>
					<ul className="flex flex-col gap-y-2 text-zinc-800 text-md mt-3">
						<li>
							<NavLink
								href="/inventory"
								exact
								className="rounded-xl flex items-center gap-x-2 px-3 py-2 "
							>
								<Home className="h-4 w-4 text-zinc-800" />
								Inventario
							</NavLink>
						</li>
						<li>
							<NavLink
								href="/inventory/items"
								className="rounded-xl flex items-center gap-x-2 px-3 py-2"
							>
								<Package className="h-4 w-4 text-zinc-800" />
								Items
							</NavLink>
						</li>
						<li>
							<NavLink
								href="/inventory/movements"
								className="rounded-xl flex items-center gap-x-2 px-3 py-2"
							>
								<ArrowDownUp className="h-4 w-4 text-zinc-800" />
								Movimientos
							</NavLink>
						</li>
						<div className="mb-3"></div>
						{/* <li>
							<Dialog>
								<DialogTrigger asChild>
									<button className="w-full rounded-xl flex items-center gap-x-2 px-3 py-2 bg-red-800/30 text-zinc-100 hover:bg-red-800/90 transition">
										<ArrowDown className="h-4 w-4 text-zinc-100" />
										Agregar Salida
									</button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>
											Agregar Salida
										</DialogTitle>
										<DialogDescription>
											Suma al registro de movimientos la
											salida del material.
										</DialogDescription>
									</DialogHeader>
									<EgressForm />
								</DialogContent>
							</Dialog>
						</li> */}
						{/* <li>
							<Dialog>
								<DialogTrigger asChild>
									<button className="w-full rounded-xl flex items-center gap-x-2 px-3 py-2 bg-green-800/30 text-zinc-100 hover:bg-green-800/90 transition focus:bg-green-800/60">
										<ArrowUp className="h-4 w-4 text-zinc-100" />
										Agregar Ingreso
									</button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Edit profile</DialogTitle>
										<DialogDescription>
											description
										</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4"></div>
									<DialogFooter>
										<button>boton</button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</li> */}
					</ul>
				</div>
				<div className="flex flex-row gap-x-3 items-center">
					<div className="rounded-full bg-zinc-800 p-1 px-2.5 text-sm font-semibold">
						{user.firstName[0]}
					</div>
					<div>
						<h2 className="leading-none text-zinc-800">
							{user.firstName.split(" ")[0] +
								" " +
								user.lastName.split(" ")[0]}
						</h2>
						<span className="text-xs leading-none font-semibold text-zinc-500">
							{user.role}
						</span>
					</div>
				</div>
			</div>
		</aside>
	);
}
