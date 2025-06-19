---
title: Checking Types in Go
date: 2024-03-01
description: A simple way to check types in golang.
draft: false
category: go
---

## How to check types of value in Go?

> [!info]
> Simple ways to check types in golang. The last one with swtich statement is the most useful for complex types.

## Using the `fmt` package

```go
package main

import "fmt"

func main() {
    x := 10
    fmt.Printf("Type of x is %T\n", x) // Output: Type of x is int
}
```

## Using `reflect` package

```go
package main
import (
    "fmt"
    "reflect"
)
func main() {
    x := 10
    fmt.Println(reflect.TypeOf(x)) // Output: int
}
```

## Using type assertions

```go
package main

import "fmt"

func main() {
    var i interface{} = "hello"

    if s, ok := i.(string); ok {
        fmt.Println("i is a string:", s)
    } else {
        fmt.Println("i is not a string")
    }
}
```

## Using switch statement

```go
package main

import "fmt"

func main() {
    var i interface{} = 10

    switch i.(type) {
    case int:
        fmt.Println("i is an int")
    case string:
        fmt.Println("i is a string")
    default:
        fmt.Println("i is of unknown type")
    }
}

```
