import { hub } from 'dom-native';
import { deepClone } from 'utils-min';
const { assign } = Object;

const dcoHub = hub('dcoHub');

type Ided = { id: number };

class DcoMock<E extends Ided>{
	#entity: string;
	#seq = 0;
	#store = new Map<number, E>();

	constructor(entity: string) {
		this.#entity = entity;
	}

	async create(data: Omit<E, 'id'>) {
		// create and store new data entity
		const id = this.#seq++;
		const dataToStore = assign(deepClone(data), { id }) as E;
		this.#store.set(dataToStore.id, dataToStore);

		// trigger dco create event
		const entity = deepClone(dataToStore);
		dcoHub.pub(this.#entity, 'create', entity);
		return entity;
	}

	async get(id: number): Promise<E | undefined> {
		const storedData = this.#store.get(id);
		return deepClone(storedData);
	}

	async update(id: number, data: Partial<E>) {
		// get the storedData
		if (data.id != null && data.id != id) throw new Error(`DcoProto Update - No data.id ${data.id} does not match with id ${id}`);
		const storedData = this.#store.get(id);
		if (storedData == null) throw new Error(`DcoProto Update - No data found for id ${id}`);

		// update the stored data	
		assign(storedData, deepClone(data));

		// trigger data event
		const entity = deepClone(storedData);
		dcoHub.pub(this.#entity, 'update', entity);
		return entity;
	}

	async list(): Promise<E[]> {
		const dataList: E[] = [];

		for (const entity of this.#store.values()) {
			dataList.push(deepClone(entity));
		}

		// NOTE: For now, just default to a desc on "create order"
		return dataList.reverse();
	}

}

//#region    ---------- Task DCO ---------- 
export interface Task {
	id: number;
	title: string;
	fav?: boolean;
	done?: boolean;
}

export const taskDco = new DcoMock<Task>('Task');

// mock data
taskDco.create({ title: 'One', fav: true });
taskDco.create({ title: 'two', done: true });
taskDco.create({ title: 'Three' });
//#endregion ---------- /Task DCO ----------