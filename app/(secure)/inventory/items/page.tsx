"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Spinner, Title } from "_components";
import { useItemService, useMovementService, useUserService } from "_services";
import { Button, buttonVariants } from "_components/ui/button";
import { DataTableDemo } from "_components/items";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "_components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "_components/ui/dropdown-menu";
import { MoreHorizontal, Star, StarOff } from "lucide-react";
import { Badge } from "_components/ui/badge";

export default Items;

function Items() {
	const userService = useUserService();
	const user = userService.currentUser;
	const itemService = useItemService();
	const items = itemService.items;
	const movementService = useMovementService();
	const movements = movementService.movements;

	//convert array of clients - items
	const newListItems = items
		?.filter((obj) => obj.category !== "EQUIPO MSM")
		.map((item) => {
			const { id, minStock } = item;
			return {
				...item,
				stockTotal: stockTotal(id),
				status: status(id, minStock),
			};
		});

	function status(itemId: any, stockMin: number) {
		const resIng: number | undefined = movements
			?.filter((e) => e.type === "Ingreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		const resEgr: number | undefined = movements
			?.filter((e) => e.type === "Egreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		if (typeof resIng === "number" && typeof resEgr === "number") {
			const result: number = resIng - resEgr;
			if (result <= 0) {
				return "Sin Stock";
			} else if (result <= stockMin) {
				return "Stock Min";
			} else if (result > stockMin) {
				return "Con Stock";
			}
		} else {
			return "Error";
		}
	}

	function stockTotal(itemId: any) {
		const resIng: number | undefined = movements
			?.filter((e) => e.type === "Ingreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		const resEgr: number | undefined = movements
			?.filter((e) => e.type === "Egreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		if (typeof resIng === "number" && typeof resEgr === "number") {
			const result: number = resIng - resEgr;

			if (result < 0) {
				return "Stock Error";
			}
			return result;
		} else {
			return "Error";
		}
	}

	useEffect(() => {
		userService.getCurrent();
		itemService.getAll();
		movementService.getAll();
	}, []);

	if (user?.role === "SUPERADMIN") {
		return (
			<div className="flex flex-col gap-4">
				<Title>Items</Title>
				<div className="flex gap-x-2">
					<Link
						href="/inventory/items/add"
						className={buttonVariants({ variant: "secondary" })}
					>
						Agregar Item
					</Link>
				</div>
				<div className="w-full">
					{/* <div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Descripción</TableHead>
									<TableHead>Categoría</TableHead>
									<TableHead>UM</TableHead>
									<TableHead>Stock Min.</TableHead>
									<TableHead>Destacado</TableHead>
									<TableHead>Stock Actual</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableBodyComponentSuperadmin />
							</TableBody>
						</Table>
					</div> */}
					<DataTableDemo
						data={newListItems}
						itemService={itemService}
						role="SUPERADMIN"
					/>
				</div>
			</div>
		);
	}

	if (user?.role === "ADMIN") {
		return (
			<div className="flex flex-col gap-4">
				<Title>Items</Title>
				<div className="w-full">
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Descripción</TableHead>
									<TableHead>Categoría</TableHead>
									<TableHead>UM</TableHead>
									<TableHead>Stock Min.</TableHead>
									<TableHead>Destacado</TableHead>
									<TableHead>Stock Actual</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableBodyComponentAdmin />
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<Spinner />
		</div>
	);

	function TableBodyComponentSuperadmin() {
		if (newListItems?.length) {
			return newListItems.map((item) => (
				<TableRow key={item.id}>
					<TableCell>{item.description}</TableCell>
					<TableCell>{item.category}</TableCell>
					<TableCell>{item.undMed}</TableCell>
					<TableCell>{item.minStock}</TableCell>
					<TableCell>
						{item.important ? (
							<Star className="h-4 w-4 text-yellow-400" />
						) : (
							<StarOff className="h-4 w-4 text-neutral-600" />
						)}
					</TableCell>
					<TableCell>{item.stockTotal}</TableCell>
					<TableCell>
						{item.status === "Con Stock" ? (
							<Badge variant="success">Con Stock</Badge>
						) : null}
						{item.status === "Stock Min" ? (
							<Badge variant="warning">Stock Min</Badge>
						) : null}
						{item.status === "Sin Stock" ? (
							<Badge variant="error">Sin Stock</Badge>
						) : null}
					</TableCell>
					<TableCell>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">
										Abrir opciones
									</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Opciones</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Link
										href={`/inventory/items/edit/${item.id}`}
										className="w-full h-full"
									>
										Editar
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<button
										onClick={() =>
											window.confirm(
												"¿Seguro que deseas eliminar el registro?"
											)
												? itemService.delete(item.id)
												: null
										}
										disabled={item.isDeleting}
										className="w-full h-full flex"
									>
										{item.isDeleting ? (
											<span className="spinner-border spinner-border-sm">
												Eliminando...
											</span>
										) : (
											<span>Eliminar</span>
										)}
									</button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</TableCell>
				</TableRow>
			));
		}

		if (!newListItems) {
			return (
				<tr>
					<td colSpan={4}>
						<Spinner />
					</td>
				</tr>
			);
		}

		if (newListItems?.length === 0) {
			return (
				<TableRow>
					<TableCell className="h-24 text-center">
						Sin Resultados.
					</TableCell>
				</TableRow>
			);
		}
	}

	function TableBodyComponentAdmin() {
		if (newListItems?.length) {
			return newListItems.map((item) => (
				<TableRow key={item.id}>
					<TableCell>{item.description}</TableCell>
					<TableCell>{item.category}</TableCell>
					<TableCell>{item.undMed}</TableCell>
					<TableCell>{item.minStock}</TableCell>
					<TableCell>
						{item.important ? (
							<Star className="h-4 w-4 text-yellow-400" />
						) : (
							<StarOff className="h-4 w-4 text-neutral-600" />
						)}
					</TableCell>
					<TableCell>{item.stockTotal}</TableCell>
					<TableCell>
						{item.status === "Con Stock" ? (
							<Badge variant="success">Con Stock</Badge>
						) : null}
						{item.status === "Stock Min" ? (
							<Badge variant="warning">Stock Min</Badge>
						) : null}
						{item.status === "Sin Stock" ? (
							<Badge variant="error">Sin Stock</Badge>
						) : null}
					</TableCell>
				</TableRow>
			));
		}

		if (!newListItems) {
			return (
				<tr>
					<td colSpan={4}>
						<Spinner />
					</td>
				</tr>
			);
		}

		if (newListItems?.length === 0) {
			return (
				<TableRow>
					<TableCell className="h-24 text-center">
						Sin Resultados.
					</TableCell>
				</TableRow>
			);
		}
	}
}
