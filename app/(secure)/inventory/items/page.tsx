"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Spinner, Title } from "_components";
import { useItemService, useMovementService, useUserService } from "_services";
import { DataTableDemo } from "_components/items";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "_components/new-ui/Table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "_components/ui/dropdown-menu";
import { MoreHorizontal, Star, StarOff } from "lucide-react";
import { buttonVariants } from "_components/ui/button";
import { Button } from "_components/new-ui/Button";
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

	const newListItemsPe = items
		?.filter((obj) => obj.category !== "EQUIPO MSM")
		.map((item) => {
			const { id, minStock } = item;
			return {
				...item,
				stockTotal: stockTotalPe(id),
				status: statusPe(id, minStock),
			};
		});

	function status(itemId: any, stockMin: number) {
		const resIng: number | undefined = movements
			?.filter((e) => e.district !== "PERENÉ")
			?.filter((e) => e.type === "Ingreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		const resEgr: number | undefined = movements
			?.filter((e) => e.district !== "PERENÉ")
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

	function statusPe(itemId: any, stockMin: number) {
		const resIng: number | undefined = movements
			?.filter((e) => e.district === "PERENÉ")
			?.filter((e) => e.type === "Ingreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		const resEgr: number | undefined = movements
			?.filter((e) => e.district === "PERENÉ")
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
			?.filter((e) => e.district !== "PERENÉ")
			?.filter((e) => e.type === "Ingreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		const resEgr: number | undefined = movements
			?.filter((e) => e.district !== "PERENÉ")
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

	function stockTotalPe(itemId: any) {
		const resIng: number | undefined = movements
			?.filter((e) => e.district === "PERENÉ")
			?.filter((e) => e.type === "Ingreso")
			.filter((e) => e.Item.id === itemId)
			.map((item) => item.amount)
			.reduce((prev, curr) => prev + curr, 0);
		const resEgr: number | undefined = movements
			?.filter((e) => e.district === "PERENÉ")
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
					<Button>
						<Link
							href="/inventory/items/add"
							className={buttonVariants({ variant: "secondary" })}
						>
							Agregar Item
						</Link>
					</Button>
				</div>
				<div className="w-full">
					<h2 className="mb-4 text-lg text-zinc-400">
						Sede San Ramón
					</h2>
					<DataTableDemo
						data={newListItems}
						itemService={itemService}
						role="SUPERADMIN"
					/>
				</div>
				{/* <div className="w-full">
					<h2 className="mb-4 text-lg text-zinc-400">Perené</h2>
					<DataTableDemo
						data={newListItemsPe}
						itemService={itemService}
						role="SUPERADMIN"
					/>
				</div> */}
			</div>
		);
	}

	if (user?.role === "ADMIN") {
		return (
			<div className="flex flex-col gap-4">
				<Title>Items</Title>
				<div className="w-full">
					<div className="rounded-md">
						<DataTableDemo
							data={newListItems}
							itemService={itemService}
							role="SUPERADMIN"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<Title>Control de Stock</Title>
					<div>
						<div className="grid grid-cols-3 gap-3">
							<div className="flex flex-col gap-2">
								<Badge variant="success">
									Tabla de Items En Stock
								</Badge>
								<div className="rounded-md border border-zinc-700">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead></TableHead>
												<TableHead>
													Descripción
												</TableHead>
												<TableHead>
													Stock Actual
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{newListItems &&
												newListItems
													.filter(
														(item) =>
															item.status ===
															"Con Stock"
													)
													.map((item) => (
														<TableRow key={item.id}>
															<TableCell>
																{item.important ? (
																	<Star className="h-4 w-4 text-yellow-400" />
																) : (
																	<StarOff className="h-4 w-4 text-neutral-600" />
																)}
															</TableCell>
															<TableCell>
																{
																	item.description
																}
															</TableCell>
															<TableCell>
																{
																	item.stockTotal
																}
															</TableCell>
														</TableRow>
													))}
										</TableBody>
									</Table>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Badge variant="warning">
									Tabla de Items En Stock Mínimo
								</Badge>
								<div className="rounded-md border border-zinc-700">
									<Table className="font-medium text-zinc-100">
										<TableHeader>
											<TableRow>
												<TableHead></TableHead>
												<TableHead>
													Descripción
												</TableHead>
												<TableHead>
													Stock Actual
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{newListItems &&
												newListItems
													.filter(
														(item) =>
															item.status ===
															"Stock Min"
													)
													.map((item) => (
														<TableRow key={item.id}>
															<TableCell>
																{item.important ? (
																	<Star className="h-4 w-4 text-yellow-400" />
																) : (
																	<StarOff className="h-4 w-4 text-neutral-600" />
																)}
															</TableCell>
															<TableCell>
																{
																	item.description
																}
															</TableCell>
															<TableCell>
																{
																	item.stockTotal
																}
															</TableCell>
														</TableRow>
													))}
										</TableBody>
									</Table>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Badge variant="error">
									Tabla de Items Sin Stock
								</Badge>
								<div className="rounded-md border border-zinc-700">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead></TableHead>
												<TableHead>
													Descripción
												</TableHead>
												<TableHead>
													Stock Actual
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{newListItems &&
												newListItems
													.filter(
														(item) =>
															item.status ===
															"Sin Stock"
													)
													.map((item) => (
														<TableRow key={item.id}>
															<TableCell>
																{item.important ? (
																	<Star className="h-4 w-4 text-yellow-400" />
																) : (
																	<StarOff className="h-4 w-4 text-neutral-600" />
																)}
															</TableCell>
															<TableCell>
																{
																	item.description
																}
															</TableCell>
															<TableCell>
																{
																	item.stockTotal
																}
															</TableCell>
														</TableRow>
													))}
										</TableBody>
									</Table>
								</div>
							</div>
						</div>
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
}
