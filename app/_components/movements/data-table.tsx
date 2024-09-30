"use client";

import * as React from "react";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronDown,
	MoreHorizontal,
	Star,
	StarOff,
} from "lucide-react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Button } from "_components/ui/button";
import { Checkbox } from "_components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "_components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "_components/ui/table";
import { IMovement } from "_services";
import { Badge } from "_components/ui/badge";
import Link from "next/link";
import { Input } from "_components/ui/input";

export const columns: ColumnDef<IMovement>[] = [
	{
		accessorKey: "type",
		header: "Tipo",
		cell: ({ row }) => <div>{row.getValue("type")}</div>,
	},
	{
		accessorKey: "date",
		header: ({ column }) => {
			return (
				<button
					className="flex items-center gap-0.5 py-2"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Fecha
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
	{
		accessorKey: "amount",
		header: "Cantidad",
		cell: ({ row }) => <div>{row.getValue("undMed")}</div>,
	},
	{
		accessorKey: "item",
		header: "Item",
		cell: ({ row }) => <div>{row.original.Item.description}</div>,
	},
	{
		accessorKey: "reason",
		header: "Razón",
		cell: ({ row }) => <div>{row.getValue("reason")}</div>,
	},
	{
		accessorKey: "obs",
		header: "Obs.",
		cell: ({ row }) => <div>{row.getValue("obs")}</div>,
	},
	{
		id: "actions",
		enableHiding: false,
	},
];

interface children {
	data: Array<IMovement> | undefined;
	itemService: any;
	role?: string;
}

export { DataTable };

function DataTable({ data, itemService }: children) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	if (data === undefined) {
		data = [];
	}

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="w-full flex flex-col gap-3">
			{/* <Input
				placeholder="Filtrar descripción..."
				value={
					(table
						.getColumn("description")
						?.getFilterValue() as string) ?? ""
				}
				onChange={(event) =>
					table
						.getColumn("description")
						?.setFilterValue(event.target.value)
				}
				className="max-w-sm"
			/> */}
			<div className="rounded-md border border-zinc-700">
				<Table>
					<TableHeader className="text-zinc-400">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-zinc-700"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="border-zinc-700 text-zinc-300"
								>
									<TableCell>
										{row.original.type === "Ingreso" ? (
											<div>
												<Badge variant="success">
													<div className="flex items-center gap-1">
														<ArrowUp className="h-3 w-3" />
														Ingreso
													</div>
												</Badge>
											</div>
										) : null}
										{row.original.type === "Egreso" ? (
											<div>
												<Badge variant="error">
													<div className="flex items-center gap-1">
														<ArrowDown className="h-3 w-3" />
														Egreso
													</div>
												</Badge>
											</div>
										) : null}
									</TableCell>
									<TableCell>
										{row.original.date &&
											new Date(
												row.original.date
											).toLocaleDateString("es-PE", {
												timeZone: "UTC",
												year: "numeric",
												month: "numeric",
												day: "numeric",
											})}
									</TableCell>
									<TableCell>{row.original.amount}</TableCell>
									<TableCell>
										{row.original.Item.description}
									</TableCell>
									<TableCell>{row.original.reason}</TableCell>
									<TableCell>
										{
											row.original.Staff.firstName.split(
												" "
											)[0]
										}
									</TableCell>
									<TableCell>{row.original.obs}</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0"
												>
													<span className="sr-only">
														Abrir opciones
													</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>
													Opciones
												</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem>
													<Link
														href={`/inventory/movements/edit/${row.original._id}`}
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
																? itemService.delete(
																		row
																			.original
																			._id
																  )
																: null
														}
														disabled={
															row.original
																.isDeleting
														}
														className="w-full h-full flex"
													>
														{row.original
															.isDeleting ? (
															<span className="spinner-border spinner-border-sm">
																Eliminando...
															</span>
														) : (
															<span>
																Eliminar
															</span>
														)}
													</button>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Sin resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
