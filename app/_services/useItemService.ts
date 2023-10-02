import { create } from "zustand";

import { useAlertService } from "_services";
import { useFetch } from "_helpers/client";

export { useItemService };

// state store
const initialState = {
	items: undefined,
	item: undefined,
};
const itemStore = create<IItemStore>(() => initialState);

function useItemService(): IItemService {
	const alertService = useAlertService();
	const fetch = useFetch();
	const { items, item } = itemStore();

	return {
		items,
		item,
		getAll: async () => {
			itemStore.setState({ items: await fetch.get("/api/items") });
		},
		getById: async (id) => {
			itemStore.setState({ item: undefined });
			try {
				itemStore.setState({
					item: await fetch.get(`/api/items/${id}`),
				});
			} catch (error: any) {
				alertService.error(error);
			}
		},
		create: async (item) => {
			await fetch.post("/api/items", item);
		},
		update: async (id, params) => {
			await fetch.put(`/api/items/${id}`, params);
		},
		delete: async (id) => {
			// set isDeleting prop to true on item
			itemStore.setState({
				items: items!.map((x) => {
					if (x.id === id) {
						x.isDeleting = true;
					}
					return x;
				}),
			});

			// delete item
			await fetch.delete(`/api/items/${id}`);

			// remove deleted item from state
			itemStore.setState({ items: items!.filter((x) => x.id !== id) });
		},
	};
}

// interfaces

interface IItem {
	id: string;
	isDeleting?: boolean;
	// labels
	description: string;
	category: string;
	model: string;
	brand: string;
	undMed: string;
	minStock: number;
	important: boolean;
	state: string;
}

interface IItemStore {
	items?: IItem[];
	item?: IItem;
}

interface IItemService extends IItemStore {
	getAll: () => Promise<void>;
	getById: (id: string) => Promise<void>;
	create: (item: IItem) => Promise<void>;
	update: (id: string, params: Partial<IItem>) => Promise<void>;
	delete: (id: string) => Promise<void>;
}
