---
title: Struct and Interfaces in Go
date: 2024-06-01
description: Struct vs Interface in Go
draft: false
category: go
---

## Go Structs

A Go struct is similar to a TypeScript class in terms of representing data with fields and methods. It’s used to define concrete types that hold data.

Struct in Go:
• A struct groups fields (variables) together, similar to a TypeScript class’s properties.
• You can define methods on a struct in Go, much like methods in a TypeScript class.

Example of a Go struct:

```go
type Employee struct {
    name string
    age  int
}
func (e *Employee) Work() string {
    return e.name + " is working"
}
```

This is similar to a TypeScript class where you define a class with properties and methods:

Equivalent TypeScript class:

```typescript
class Employee {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  work(): string {
    return `${this.name} is working`;
  }
}
```

So, Go struct is a way to define a concrete type with fields and methods, just like how you use classes in TS. However, Go structs don’t have constructors, but you can write a factory function to initialize them.

## Go Interfaces

A Go interface is conceptually similar to a TypeScript interface, but Go interfaces are more flexible and implicit.

• In Go, an interface defines a set of methods that a type (usually a struct) must implement, but it doesn’t define fields (like in TypeScript).
• Important difference: In Go, you don’t have to explicitly say `a type implements an interface`. If the type has all the methods that the interface requires, it automatically satisfies the interface.

Example of a Go interface:

```go
type Worker interface {
    Work() string
}
```

Any type (like Employee) that has a Work method will automatically implement the Worker interface, without needing to explicitly declare it.

Example usage:

```go

func startWork(w Worker) {
    fmt.Println(w.Work())
}

emp := Employee{name: "John", age: 30}
startWork(&emp) // Output: John is working
```

Here, Employee satisfies the Worker interface because it has the Work method. This is similar to passing a class that implements an interface in TS.

Equivalent TypeScript interface

```typescript
interface Worker {
  work(): string;
}

class Employee implements Worker {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  work(): string {
    return `${this.name} is working`;
  }
}

function startWork(w: Worker) {
  console.log(w.work());
}

const emp = new Employee("John", 30);
startWork(emp); // Output: John is working
```

## When to Use Struct vs Interface in Go?

• Use struct when you need to define concrete data types with fields and methods. It’s like a blueprint for objects.
• For example, Employee, Car, Person—where you need to store specific data and perform actions on it.
• Use interface when you want to define behavior (methods) that can be shared across different types. Interfaces let you work with different concrete types as long as they satisfy the behavior defined by the interface.
• For example, Worker—which can be implemented by many types like Employee, Contractor, etc.

## Key Differences:

• Go structs are like TS classes (they hold data and can have methods).
• Go interfaces define behavior (methods) without defining data, similar to TS interfaces, but Go interfaces are implicitly implemented.

## Important Discussion

- https://www.reddit.com/r/golang/comments/s65749/new_to_golang_when_do_i_use_a_struct_as_a_type/
