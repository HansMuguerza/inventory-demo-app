import Link from "next/link";
import NavLink from "./NewNavLink";

export default function Sidebar() {
	return (
		<nav className="bg-blue-800 text-blue-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
			<div>
				<ul className="flex flex-col gap-y-2">
					<li>
						<NavLink href="/" exact>
							<img
								src="/logo.ico"
								alt="TVCAPECE"
								className="w-10"
							/>
						</NavLink>
					</li>
					<li>
						<NavLink href="/inventory">Dashboard</NavLink>
					</li>
					<li>
						<NavLink href="/inventory/items">Items</NavLink>
					</li>
					<li>
						<NavLink href="/inventory/movements">
							Movimientos
						</NavLink>
					</li>
				</ul>
			</div>
		</nav>
	);
}
