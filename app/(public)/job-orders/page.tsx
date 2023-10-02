"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

//import components ui
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
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
import { Input } from "_components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "_components/ui/table";

export default JobOrders;

function JobOrders() {
	const [jobOrders, setJobOrders] = useState([]);
	const [isLoading, setIsLoading] = useState({});

	const JOB_ORDERS_URL_GS =
		"https://docs.google.com/spreadsheets/d/e/2PACX-1vTMSuatDRx66Yg9Z9y5iMd9_NO5nmfoKGbf8SDcw0xJJ5iTQwpqEFf7ifvZbqcnw36tHAy2MEPkSkvR/pub?gid=1504437149&single=true&output=csv";

	const getJobOrders = async () => {
		try {
			setIsLoading((prev) => ({ ...prev, getJobOrders: true }));
			const res = await fetch(JOB_ORDERS_URL_GS);
			const data = await res.text();
			const parsed = await new Promise((resolve, reject) => {
				Papa.parse(data, {
					header: true,
					complete: resolve,
					error: reject,
				});
			});
			if (Array.isArray(parsed) && parsed.length > 0) {
				setJobOrders(parsed[0].data);
			} else {
				console.error("Los datos analizados no son válidos");
			}
			// setJobOrders(parsed.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading((prev) => ({ ...prev, getJobOrders: false }));
		}
	};

	useEffect(() => {
		getJobOrders();
	}, []);

	return (
		<div>
			<Table>
				{/* <TableCaption>A list of your recent invoices.</TableCaption> */}
				<TableHeader>
					<TableRow>
						<TableHead>Fecha y Hora del Registro</TableHead>
						<TableHead>Tipo de trabajo</TableHead>
						<TableHead>Nombre Completo</TableHead>
						<TableHead>Sector</TableHead>
						<TableHead>Nro. Celular</TableHead>
						<TableHead className="w-[100px]">
							Tipo de Servicio
						</TableHead>
						<TableHead className="text-right">Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{jobOrders
						.filter((item) => item["ESTADO"] === "")
						.map((item, index) => (
							<TableRow key={index}>
								<TableCell>{item["Marca temporal"]}</TableCell>
								<TableCell>{item["Tipo de Trabajo"]}</TableCell>
								<TableCell className="font-medium">
									{item["Datos de Cliente"]}
								</TableCell>
								<TableCell className="font-medium">
									{item["Sector"]}
								</TableCell>
								<TableCell className="font-medium">
									{item["Celular"]}
								</TableCell>
								<TableCell>
									{item["T. DE SERVICIO"] === "DUO" ? (
										<div className="bg-violet-800 text-violet-200 p-2 rounded-md">
											{item["T. DE SERVICIO"]}
										</div>
									) : null}
									{item["T. DE SERVICIO"] === "INTERNET" ? (
										<div className="bg-sky-800 text-sky-200 p-2 rounded-md">
											{item["T. DE SERVICIO"]}
										</div>
									) : null}
									{item["T. DE SERVICIO"] === "CABLE" ? (
										<div className="bg-amber-800 text-amber-200 p-2 rounded-md">
											{item["T. DE SERVICIO"]}
										</div>
									) : null}
								</TableCell>
								<TableCell>{item["DIRECCION"]}</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
