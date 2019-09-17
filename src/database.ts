import { Address } from "./address";
import { dbGet, dbStore, dbIterator, dbUpdate, dbRemove, dbRetrieve, dbNext } from "../internal/database.d";
import { StringToUsize } from "../lib/codec";
import { Assert } from "./system";
import { CreateDataStream } from "../lib/helper";

export class Iterator<T extends Serializable> {
	_db: Database<T>
	_itr: i32;

	constructor(db: Database<T>, itr: i32) {
		this._db = db;
		this._itr = itr;
	}

	get(): T {
		const size = dbRetrieve(this._db._contract.buffer, StringToUsize(this._db._table), this._db._table.length, this._itr, 0, 0);
		const bytes = new Bytes(size);
		const ds = new DataStream(changetype<usize>(bytes.buffer), size);
		dbRetrieve(this._db._contract.buffer, StringToUsize(this._db._table), this._db._table.length, this._itr, ds.buffer, size);
		let obj = {} as T;
		obj.deserialize(ds);
		return obj;
	}

	next(): void {
		this._itr = dbNext(this._db._contract.buffer, StringToUsize(this._db._table), this._db._table.length, this._itr);
	}

	end(): bool {
		return this._itr == -1;
	}
}

export class Database<T extends Serializable> {
	_contract: Address;
	_table: string;

	constructor(contract: Address, table: string) {
		this._contract = contract;
		this._table = table;
	}

	get(key: string): T {
		const size = dbGet(this._contract.buffer, StringToUsize(this._table), this._table.length, StringToUsize(key), key.length, 0, 0);
		if (size == 0) {
			return null;
		}
		const ds = CreateDataStream(size)
		dbGet(this._contract.buffer, StringToUsize(this._table), this._table.length, StringToUsize(key), key.length, ds.buffer, size);
		let obj = {} as T;
		obj.deserialize(ds);
		return obj
	}

	store(obj: T): void {
		const key = obj.key();
		const len = DataStream.measure<T>(obj)
		const ds = CreateDataStream(len)
		obj.serialize(ds);
		dbStore(StringToUsize(this._table), this._table.length, StringToUsize(key), key.length, ds.buffer, ds.len);
	}

	update(obj: T): void {
		const key = obj.key();
		const len = DataStream.measure<T>(obj)
		const ds = CreateDataStream(len)
		obj.serialize(ds);
		dbUpdate(StringToUsize(this._table), this._table.length, StringToUsize(key), key.length, ds.buffer, ds.len);
	}

	exist(key: string): bool {
		const size = dbGet(this._contract.buffer, StringToUsize(this._table), this._table.length, StringToUsize(key), key.length, 0, 0);
		return size != 0;
	}

	iterator(): Iterator<T> {
		let itr = dbIterator(this._contract.buffer, StringToUsize(this._table), this._table.length);
		return new Iterator<T>(this, itr);
	}

	remove(key: string): void {
		dbRemove(StringToUsize(this._table), this._table.length, StringToUsize(key), key.length);
	}
}