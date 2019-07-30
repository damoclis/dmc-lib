import { Contract } from "../../src/contract";
import { HashMap } from "../../lib/hashmap";
import { Database } from "../../src/database";
import { Assert } from "../../src/system";

class Person implements Serializable {
  @key
  name: string;

  constructor(name?: string) {
    this.name = name || '';
  }
}

@database("halibote")
class Book implements Serializable {
  @key
  name: string
  pages: HashMap<u64, string>;
  heros: HashMap<u64, Person>;

  constructor(name?: string) {
    this.name = name || '';
    this.pages = new HashMap<u64, string>();
    this.heros = new HashMap<u64, Person>();
  }
}

class HashMapTest extends Contract {
  _book: string = "halibote"
  _db: Database<Book>;

  constructor() {
    super();
    this._db = new Database<Book>(this.self, "book");
  }

  @action
  storePageTest(): void {
    let p1 = new Person("qiang");
    let p2 = new Person("lowes");

    let book = this._db.get(this._book);
    if (book.name == "") {
      book = new Book(this._book);
    }
    book.pages.set(1, "hi")
    book.heros.set(1, p1);
    book.pages.set(2, "hi")
    book.heros.set(2, p2);

    this._db.store(book);

    let book2 = this._db.get(this._book);
    Assert(book2.name == this._book, "book not exist");
    Assert(book2.pages.get(1) == "hi", "page 1 mismatch");
    Assert(book2.pages.get(2) == "hi", "page 2 mismatch");
    Assert(book2.heros.get(1).name == p1.name, "hero 1 mismatch");
    Assert(book2.heros.get(2).name == p2.name, "hero 2 mismatch");
  }
}