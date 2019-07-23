import { Contract } from "../../index";


// 声明数据表person，定义每列数据的字段。底层为k-v型存储。
// 简单来说：在合约的数据表`person`中，存储若干数据格式为`Person`的记录。
// @database("person")
// class Person implements Serializable {
//   name: string
//   age: u32;

//   // 声明主键
//   key(): string { return this.name; }
// }

// class Person{

// }    

class HelloWorld extends Contract {


  // 定义合约方法`hi`
  @action
  hi(msg: string): void {
    // 打印日志
    Prints(msg);
  }


  // 定义合约方法`add`
  @action
  add(a: u64, b: u64): void {
    ReturnU64(SafeMath.add(a, b));
  }

  @action
  store(): void {
    const person = new Person();
    person.name = "bob";
    person.age = 16;
    // 创建一个数据库实例
    // 第一个参数为数据库所在合约，第二个参数为数据表名称
    const db = new Database<Person>(this.receiver, "person");
    // 写操作只对合约本身的数据表生效
    db.store(person);
  }
}