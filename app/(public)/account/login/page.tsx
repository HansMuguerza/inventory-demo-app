"use client";

import { useForm } from "react-hook-form";
import { useUserService } from "_services";
import { Input, Button } from "_components/new-ui";
import { Loader } from "lucide-react";

export default function Login() {
	const userService = useUserService();

	const { register, handleSubmit, formState } = useForm();
	const { errors } = formState;

	const fields = {
		username: register("username", { required: "Username is required" }),
		password: register("password", { required: "Password is required" }),
	};

	async function onSubmit({ username, password }: any) {
		await userService.login(username, password);
	}

	return (
		<main>
			<div className="flex justify-center pt-16">
				<div className="w-[350px] flex flex-col gap-y-6">
					<div className="flex flex-col items-center">
						<div className="flex flex-col items-center gap-2 mb-6">
							<p className="text-sm">
								DISTRIBUCIONES E INVERSIONES
							</p>
							<img
								src="/logo-dija-n.svg"
								alt="TVCAPECE"
								className="w-44"
							/>
						</div>
						<h1 className="text-center text-4xl font-bold mt-6">
							Bienvenido(a)👋
						</h1>
						<div className="text-center text-zinc-500 mt-2">
							Ingresa correctamente tus credenciales.
						</div>
					</div>
					<div>
						<div className="card-body">
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="flex flex-col gap-y-1"
							>
								<div className="flex flex-col space-y-1.5">
									<Input
										{...fields.username}
										type="text"
										placeholder="Usuario"
										autoComplete="false"
										className={`form-control ${
											errors.username ? "is-invalid" : ""
										}`}
									/>
									<div className="text-red-500 text-sm">
										{errors.username?.message?.toString()}
									</div>
								</div>
								<div className="flex flex-col space-y-1.5">
									<Input
										{...fields.password}
										type="password"
										placeholder="Contraseña"
										autoComplete="false"
										className={`form-control ${
											errors.password ? "is-invalid" : ""
										}`}
									/>
									<div className="text-red-500 text-sm">
										{errors.password?.message?.toString()}
									</div>
								</div>
								<div className="flex gap-x-3 mt-2">
									<Button
										disabled={formState.isSubmitting}
										className="w-full"
									>
										{formState.isSubmitting ? (
											<div className="flex items-center gap-x-1">
												<Loader className="h-4 w-4 animate-spin" />
												<span>Ingresando</span>
											</div>
										) : (
											"Ingresar"
										)}
									</Button>
								</div>
							</form>
						</div>
					</div>
					<div className="flex justify-center mt-10">
						<span className="text-center text-sm text-zinc-500 font-semibold">
							v1.8
						</span>
					</div>
				</div>
			</div>
		</main>
	);
}
