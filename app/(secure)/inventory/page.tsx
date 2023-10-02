"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Spinner, Title } from "_components";
import { useItemService, useUserService } from "_services";
import { buttonVariants } from "_components/ui/button";

export default Inventory;

function Inventory() {
	const userService = useUserService();
	const user = userService.currentUser;
	const itemService = useItemService();
	const items = itemService.items;

	useEffect(() => {
		userService.getCurrent();
		itemService.getAll();
	}, []);

	if (user?.role === "SUPERADMIN") {
		return (
			<>
				<Title>Inventario - Con vista de superadmin</Title>
				<div className="flex gap-x-2">
					<Link
						href="/inventory/items"
						className={buttonVariants({ variant: "outline" })}
					>
						Items
					</Link>
				</div>
				{/* <div>
				<table className="table table-striped">
					<thead>
						<tr>
							<th style={{ width: "30%" }}>Descripción</th>
							<th style={{ width: "30%" }}>Modelo</th>
							<th style={{ width: "30%" }}>Serie</th>
							<th style={{ width: "30%" }}>Estado</th>
							<th style={{ width: "10%" }}></th>
						</tr>
					</thead>
					<tbody>
						<TableBody />
					</tbody>
				</table>
			</div> */}
			</>
		);
	}

	if (user?.role === "ADMIN") {
		return (
			<>
				<h1>Inventario - Con vista de admin</h1>
				<div className="flex gap-x-2">
					<Link
						href="/inventory/items"
						className={buttonVariants({ variant: "outline" })}
					>
						Items
					</Link>
				</div>
				{/* <div>
				<table className="table table-striped">
					<thead>
						<tr>
							<th style={{ width: "30%" }}>Descripción</th>
							<th style={{ width: "30%" }}>Modelo</th>
							<th style={{ width: "30%" }}>Serie</th>
							<th style={{ width: "30%" }}>Estado</th>
							<th style={{ width: "10%" }}></th>
						</tr>
					</thead>
					<tbody>
						<TableBody />
					</tbody>
				</table>
			</div> */}
			</>
		);
	}

	return <Spinner />;

	// function TableBody() {
	// 	if (items?.length) {
	// 		return items.map((item) => (
	// 			<tr key={item.id}>
	// 				<td>{item.description}</td>
	// 				<td>{item.model}</td>
	// 				<td>{item.serie}</td>
	// 				<td>{item.state}</td>
	// 				<td style={{ whiteSpace: "nowrap" }}>
	// 					<Link
	// 						href={`/items/edit/${item.id}`}
	// 						className="btn btn-sm btn-primary me-1"
	// 					>
	// 						Editar
	// 					</Link>
	// 					<button
	// 						onClick={() => itemService.delete(item.id)}
	// 						className="btn btn-sm btn-danger btn-delete-user"
	// 						style={{ width: "60px" }}
	// 						disabled={item.isDeleting}
	// 					>
	// 						{item.isDeleting ? (
	// 							<span className="spinner-border spinner-border-sm">
	// 								Eliminando...
	// 							</span>
	// 						) : (
	// 							<span>Eliminar</span>
	// 						)}
	// 					</button>
	// 				</td>
	// 			</tr>
	// 		));
	// 	}

	// 	if (!items) {
	// 		return (
	// 			<tr>
	// 				<td colSpan={4}>
	// 					<Spinner />
	// 				</td>
	// 			</tr>
	// 		);
	// 	}

	// 	if (items?.length === 0) {
	// 		return (
	// 			<tr>
	// 				<td colSpan={4} className="text-center">
	// 					<div className="p-2">No hay items para mostrar.</div>
	// 				</td>
	// 			</tr>
	// 		);
	// 	}
	// }
}
