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
			model: item?.model || "",
			brand: item?.brand || "",
			serie: item?.serie || "",
			state: item?.state || "",
			undMed: item?.undMed || "",
			minStock: item?.minStock || "",
			important: item?.important || false,
		},
	});

	const fields = {
		description: form.register("description", {
			required: "Este campo es requerido.",
		}),
		category: form.register("category", {
			required: "Este campo es requerido.",
		}),
		model: form.register("model"),
		brand: form.register("brand"),
		serie: form.register("serie"),
		state: form.register("state"),
		undMed: form.register("undMed", {
			required: "Este campo es requerido.",
		}),
		minStock: form.register("minStock", {
			required: "Este campo es requerido.",
		}),
		important: form.register("important"),
	};

	async function onSubmit(data: any) {
		toast({
			title: "Notificación",
			description: <div>¡Registro Guardado!</div>,
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

	const handleUppercaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const uppercaseValue = e.target.value.toUpperCase();
		const fieldName: any = e.target.name;
		form.setValue(fieldName, uppercaseValue);
	};

	return (
		<div className="flex justify-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-[750px]"
				>
					<div className="grid grid-cols-1 gap-6">
						<Title>{title}</Title>
						<div className="grid grid-cols-2 gap-y-5 gap-x-3">
							{/* <FormField
								control={form.control}
								name="description"
								render={() => (
									<FormItem>
										<FormLabel>Descripción</FormLabel>
										<FormControl>
											<Input
												placeholder="CONECTOR RG6"
												{...fields.description}
												onChange={handleUppercaseChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/> */}
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Descripción</FormLabel>
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
												<SelectItem value="SINTONIZADOR DE TV DIGITAL">
													SINTONIZADOR DE TV DIGITAL
												</SelectItem>
												<SelectItem value="G/EPON ONU + CATV">
													G/EPON ONU + CATV
												</SelectItem>
												<SelectItem value="G/EPON ONU">
													G/EPON ONU
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="model"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Modelo</FormLabel>
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
												<SelectItem value="STD1910HD">
													STD1910HD
												</SelectItem>
												<SelectItem value="STD2010HD">
													STD2010HD
												</SelectItem>
												<SelectItem value="STD2105HD">
													STD2105HD
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="brand"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Marca</FormLabel>
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
												<SelectItem value="OPTRONICS">
													OPTRONICS
												</SelectItem>
												<SelectItem value="OPTICTIMES">
													OPTICTIMES
												</SelectItem>
												<SelectItem value="V-SOL">
													V-SOL
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="serie"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Serie</FormLabel>
										<FormControl>
											<Input
												placeholder="SERIE000"
												{...field}
												onChange={handleUppercaseChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
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
										<FormMessage />
									</FormItem>
								)}
							/>
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
