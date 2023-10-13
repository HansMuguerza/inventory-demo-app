"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Spinner, Title } from "_components";
import { useItemService, useMovementService, useUserService } from "_services";
import { buttonVariants } from "_components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "_components/ui/table";
import { Star, StarOff } from "lucide-react";
import { Badge } from "_components/ui/badge";

export default Inventory;

function Inventory() {
	const userService = useUserService();
	const user = userService.currentUser;
	const itemService = useItemService();
	const items = itemService.items;
	const movementService = useMovementService();
	const movements = movementService.movements;

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
				<Title>Inventario - Con vista de superadmin</Title>
				<div className="flex gap-x-2">
					<Link
						href="/inventory/items"
						className={buttonVariants({ variant: "outline" })}
					>
						Items
					</Link>
					{/* <Link
						href="/inventory/items-serie"
						className={buttonVariants({ variant: "outline" })}
					>
						Items con serie
					</Link> */}
					<Link
						href="/inventory/movements"
						className={buttonVariants({ variant: "outline" })}
					>
						Movimientos
					</Link>
				</div>
				<div>
					<div className="grid grid-cols-3 gap-3">
						<div className="flex flex-col gap-2">
							<Badge variant="success">
								Tabla de Items En Stock
							</Badge>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead></TableHead>
											<TableHead>Descripción</TableHead>
											<TableHead>Stock Actual</TableHead>
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
															{item.description}
														</TableCell>
														<TableCell>
															{item.stockTotal}
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
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead></TableHead>
											<TableHead>Descripción</TableHead>
											<TableHead>Stock Actual</TableHead>
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
															{item.description}
														</TableCell>
														<TableCell>
															{item.stockTotal}
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
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead></TableHead>
											<TableHead>Descripción</TableHead>
											<TableHead>Stock Actual</TableHead>
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
															{item.description}
														</TableCell>
														<TableCell>
															{item.stockTotal}
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
		);
	}

	if (user?.role === "ADMIN") {
		return (
			<>
				<Title>Inventario - Con vista de admin</Title>
				<div className="flex gap-x-2">
					<Link
						href="/inventory/items"
						className={buttonVariants({ variant: "outline" })}
					>
						Items
					</Link>
					<Link
						href="/inventory/movements"
						className={buttonVariants({ variant: "outline" })}
					>
						Movimientos
					</Link>
				</div>
			</>
		);
	}

	return <Spinner />;
}
