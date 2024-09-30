"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "_components/ui/table";

interface JobOrder {
	DATOS_DE_CLIENTE: string;
	ESTADO: string;
	FECHA: string;
	TIPO_DE_TRABAJO: string;
	SECTOR: string;
	CELULAR: string;
	TIPO_DE_SERVICIO: string;
	DIRECCION: string;
}

interface ParsedData {
	data: JobOrder[];
}

export default JobOrders;

function JobOrders() {
	const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
	const [isLoading, setIsLoading] = useState<{ getJobOrders: boolean }>({
		getJobOrders: false,
	});

	const JOB_ORDERS_URL_GS =
		"https://docs.google.com/spreadsheets/d/e/2PACX-1vSsvbTf0Cx_FnEwLPJHaOqqW4hUg0yrOQrcgvTrDLkk9bUzIyFQLbFnEN1U4UZ_LVIWnPoMXXi5Z6Ce/pub?gid=2145419652&single=true&output=csv";

	const getJobOrders = async () => {
		try {
			setIsLoading((prev) => ({ ...prev, getJobOrders: true }));
			const res = await fetch(JOB_ORDERS_URL_GS);
			const data = await res.text();
			const parsed: ParsedData = await new Promise((resolve, reject) => {
				Papa.parse(data, {
					header: true,
					complete: resolve,
					error: reject,
				});
			});
			setJobOrders(parsed.data);
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
		<div className="p-4 ">
			<div className="border rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[200px]">
								Fecha y Hora del Registro
							</TableHead>
							<TableHead>Tipo de trabajo</TableHead>
							<TableHead>Nombre Completo</TableHead>
							<TableHead>Sector</TableHead>
							<TableHead>Nro. Celular</TableHead>
							<TableHead>Tipo de Servicio</TableHead>
							<TableHead>Dirección</TableHead>
						</TableRow>
					</TableHeader>
					{isLoading.getJobOrders ? (
						<div>Cargando...</div>
					) : (
						<TableBody>
							{jobOrders
								.filter((item) => item["ESTADO"] === "")
								.map((item, index) => (
									<TableRow key={index}>
										<TableCell>{item.FECHA}</TableCell>
										<TableCell>
											{item.TIPO_DE_TRABAJO}
										</TableCell>
										<TableCell className="font-medium">
											{item.DATOS_DE_CLIENTE}
										</TableCell>
										<TableCell className="font-medium">
											{item.SECTOR}
										</TableCell>
										<TableCell className="font-medium">
											{item.CELULAR}
										</TableCell>
										<TableCell>
											{item.TIPO_DE_SERVICIO === "DUO" ? (
												<div className="bg-violet-800 text-violet-200 p-2 rounded-md">
													{item.TIPO_DE_SERVICIO}
												</div>
											) : null}
											{item.TIPO_DE_SERVICIO ===
											"INTERNET" ? (
												<div className="bg-sky-800 text-sky-200 p-2 rounded-md">
													{item.TIPO_DE_SERVICIO}
												</div>
											) : null}
											{item.TIPO_DE_SERVICIO ===
											"CABLE" ? (
												<div className="bg-amber-800 text-amber-200 p-2 rounded-md">
													{item.TIPO_DE_SERVICIO}
												</div>
											) : null}
										</TableCell>
										<TableCell>{item.DIRECCION}</TableCell>
									</TableRow>
								))}
						</TableBody>
					)}
				</Table>
			</div>
		</div>
	);
}
