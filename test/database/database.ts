import { Contract } from "../../src/contract";
import { Database } from "../../src/database";
import { Assert } from "../../src/system";

@database("people")
class Person implements Serializable {
  @key
  name: string;
  age: u32;
}

class DatabaseTest extends Contract {
  db: Database<Person>;

  constructor() {
    super();
    this.db = new Database<Person>(this.self, "people");
  }

  @action
  create(name: string, age: u32): void {
    const p = new Person();
    p.name = name;
    p.age = age;
    this.db.store(p);
  }

  @action
  getAge(name: string): u32 {
    let p = this.db.get(name);
    return p.age;
  }

  @action
  exist(name: string): bool {
    return this.db.exist(name);
  }

  @action
  update(name: string, age: u32): void {
    const p = new Person();
    p.name = name;
    p.age = age;
    this.db.update(p);
  }

  @action
  delete(name: string): void {
    this.db.remove(name);
  }

  @action
  testIterator(): void {
    const people = new Map<string, u32>();
    people.set("1", 22);
    people.set("2", 18);
    people.set("3", 24);

    const keys = people.keys();
    for (let i = 0; i < keys.length; i++) {
      const age = people.get(keys[i]);
      this.create(keys[i], age);
    }

    let itr = this.db.iterator();
    let i = 0;
    while (!itr.end()) {
      const p = itr.get();
      Assert(keys[i] == p.name, "name mismatch");
      Assert(people.get(keys[i]) == p.age, "age mismatch");
      itr.next();
      i++;
    }
  }
}