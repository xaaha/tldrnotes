---
title: Go Union Types
date: 2024-07-01
author: xaaha
image: { src: "image/gopher.svg", alt: "Gopher on a hike" }
description: A way to implement Union Type in Go
draft: false
category: Reference Docs
---

Go does not support union types. But, I found a unique way to do somewhat similar things

```go
package main

import "fmt"

// Define Method as its own type
type Method string

// Define constants that represent valid Method values
const (
	GET     Method = "GET"
	POST    Method = "POST"
	PUT     Method = "PUT"
	PATCH   Method = "PATCH"
	DELETE  Method = "DELETE"
	HEAD    Method = "HEAD"
	TRACE   Method = "TRACE"
	CONNECT Method = "CONNECT"
)

// A function that takes a Method as argument
func handleRequest(method Method) {
	switch method {
	case GET, POST, PUT, PATCH, DELETE, HEAD, TRACE, CONNECT:
		fmt.Println("Handling method:", method)
	default:
		fmt.Println("Invalid method")
	}
}

func main() {
	// This works
	handleRequest(GET)
	// This will cause the default case (invalid method)
	handleRequest("OPTIONS")
}
```
