import { create } from "zustand";

import { IItem, IUser, useAlertService } from "_services";
import { useFetch } from "_helpers/client";

export { useMovementService };

// state store
const initialState = {
	movements: undefined,
	movement: undefined,
};
const movementStore = create<IMovementStore>(() => initialState);

function useMovementService(): IMovementService {
	const alertService = useAlertService();
	const fetch = useFetch();
	const { movements, movement } = movementStore();

	return {
		movements,
		movement,
		getAll: async () => {
			movementStore.setState({
				movements: await fetch.get("/api/movements"),
			});
		},
		getById: async (id) => {
			movementStore.setState({ movement: undefined });
			try {
				movementStore.setState({
					movement: await fetch.get(`/api/movements/${id}`),
				});
			} catch (error: any) {
				alertService.error(error);
			}
		},
		create: async (movement) => {
			await fetch.post("/api/movements", movement);
		},
		update: async (id, params) => {
			await fetch.put(`/api/movements/${id}`, params);
		},
		delete: async (id) => {
			// set isDeleting prop to true on movement
			movementStore.setState({
				movements: movements!.map((x) => {
					if (x._id === id) {
						x.isDeleting = true;
					}
					return x;
				}),
			});

			// delete movement
			await fetch.delete(`/api/movements/${id}`);

			// remove deleted movement from state
			movementStore.setState({
				movements: movements!.filter((x) => x._id !== id),
			});
		},
	};
}

// interfaces

export interface IMovement {
	_id: string;
	itemId: string;
	type: string;
	date: Date;
	staffId: string;
	amount: number;
	reason: string;
	obs: string;
	isDeleting?: boolean;
	//others
	Item: IItem;
	User: IUser;
}

interface IMovementStore {
	movements?: IMovement[];
	movement?: IMovement;
}

interface IMovementService extends IMovementStore {
	getAll: () => Promise<void>;
	getById: (id: string) => Promise<void>;
	create: (movement: IMovement) => Promise<void>;
	update: (id: string, params: Partial<IMovement>) => Promise<void>;
	delete: (id: string) => Promise<void>;
}
