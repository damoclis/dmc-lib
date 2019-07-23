import { Contract } from "../../src/contract";
import { Database } from "../../src/database";
import { dbUpdate } from "../../internal/database";
import { Assert } from "../../src/system";

@database("people")
class Person implements Serializable {
  name: string;
  age: u32;

  key(): string {
    return this.name;
  }
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
    let p = new Person();
    this.db.get(name, p);
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
    const people = [
      {
        name: "1",
        age: 22
      },
      {
        name: "2",
        age: 21
      },
      {
        name: "3",
        age: 24
      }
    ]

    for (let i = 0; i < people.length; i++) {
      const p = people[i]
      this.create(p.name, p.age);
    }

    let itr = this.db.iterator();
    let i = 0;
    while (!itr.end()) {
      const p = new Person()
      itr.get(p);
      Assert(people[i].name == p.name, "name mismatch");
      Assert(people[i].age == p.age, "age mismatch");
      itr.next();
    }
  }
}