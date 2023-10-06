"use client";

// import libraries
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useAlertService, useItemService } from "_services";

// import components ui
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "_components/ui/select";
import { Button } from "_components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "_components/ui/form";
import { Input } from "_components/ui/input";
import { toast } from "_components/ui/use-toast";
import { Title } from "_components";
import { Checkbox } from "_components/ui/checkbox";

export { AddEdit };

function AddEdit({ title, item }: { title: string; item?: any }) {
	const router = useRouter();
	const alertService = useAlertService();
	const itemService = useItemService();

	const form = useForm({
		defaultValues: {
			description: item?.description || "",
			category: item?.category || "",
			// model: item?.model || "",
			brand: item?.brand || "",
			undMed: item?.undMed || "",
			minStock: item?.minStock || "",
			important: item?.important || false,
			// state: item?.state || "",
		},
	});

	const fields = {
		description: form.register("description", {
			required: "Este campo es requerido.",
		}),
		category: form.register("category", {
			required: "Este campo es requerido.",
		}),
		// model: form.register("model"),
		brand: form.register("brand"),
		undMed: form.register("undMed", {
			required: "Este campo es requerido.",
		}),
		minStock: form.register("minStock", {
			required: "Este campo es requerido.",
		}),
		important: form.register("important"),
		// state: form.register("state"),
	};

	async function onSubmit(data: any) {
		toast({
			title: "Data:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">
						{JSON.stringify(data, null, 2)}
					</code>
				</pre>
			),
		});

		alertService.clear();
		try {
			// create or update item based on item prop
			let message;
			if (item) {
				await itemService.update(item.id, data);
				message = "Item actualizado";
			} else {
				await itemService.create(data);
				message = "Item agregado";
			}

			// redirect to item list with success message
			router.push("/inventory/items");
			alertService.success(message, true);
		} catch (error: any) {
			alertService.error(error);
		}
	}

	return (
		<div className="flex justify-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-[750px]"
				>
					<div className="grid grid-cols-1 gap-6">
						<Title>{title}</Title>
						<div className="grid grid-cols-2 gap-2">
							<FormField
								control={form.control}
								name="description"
								render={() => (
									<FormItem>
										<FormLabel>Descripción</FormLabel>
										<FormControl>
											<Input
												placeholder="ONU XPON"
												{...fields.description}
											/>
										</FormControl>
										{/* <FormDescription>
											Descripción del item
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Categoría</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecciona una opción" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="FTTH">
													FTTH
												</SelectItem>
												<SelectItem value="COAXIAL">
													COAXIAL
												</SelectItem>
												<SelectItem value="AMPLIACIÓN">
													AMPLIACIÓN
												</SelectItem>
												<SelectItem value="PUBLICIDAD">
													PUBLICIDAD
												</SelectItem>
											</SelectContent>
										</Select>
										{/* <FormDescription>
											Descripción del estado del item a
											ingresar
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* <FormField
								control={form.control}
								name="model"
								render={() => (
									<FormItem>
										<FormLabel>Modelo</FormLabel>
										<FormControl>
											<Input
												placeholder="MODELO001"
												{...fields.model}
											/>
										</FormControl>
										<FormDescription>
											Descripción del item
										</FormDescription> 
										<FormMessage />
									</FormItem>
								)}
							/> */}
							<FormField
								control={form.control}
								name="brand"
								render={() => (
									<FormItem>
										<FormLabel>Marca</FormLabel>
										<FormControl>
											<Input
												placeholder="ONU XPON"
												{...fields.brand}
											/>
										</FormControl>
										{/* <FormDescription>
											Descripción del item
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="undMed"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Unidad de Medida</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecciona una opción" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="UND">
													UND
												</SelectItem>
												<SelectItem value="ROLLO">
													ROLLO
												</SelectItem>
											</SelectContent>
										</Select>
										{/* <FormDescription>
											Descripción del estado del item a
											ingresar
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="minStock"
								render={() => (
									<FormItem>
										<FormLabel>Stock Mínimo</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="10"
												{...fields.minStock}
											/>
										</FormControl>
										{/* <FormDescription>
											Descripción del item
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="important"
								render={({ field }) => (
									<FormItem className="">
										<FormLabel>Destacable</FormLabel>
										<div className="flex gap-x-2 items-center">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
											{/* <FormDescription>
												Seleccionar para destacar el
												item a ingresar.
											</FormDescription> */}
										</div>

										<FormMessage />
									</FormItem>
								)}
							/>
							{/* <FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Estado</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecciona una opción" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="NUEVO">
													NUEVO
												</SelectItem>
												<SelectItem value="RECUPERADO">
													RECUPERADO
												</SelectItem>
												<SelectItem value="REACONDICIONADO">
													REACONDICIONADO
												</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											Descripción del estado del item a
											ingresar
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/> */}
						</div>
						<div className="flex gap-x-2">
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting && (
									<span className="">Guardando...</span>
								)}
								Guardar
							</Button>
							<Button
								variant="ghost"
								onClick={() => form.reset()}
								disabled={form.formState.isSubmitting}
							>
								Restaurar
							</Button>
							<Button variant="ghost">
								<Link href="/inventory/items">Cancelar</Link>
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
