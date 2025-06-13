---
title: Using CLI Flags in Go
date: 2024-05-01
author: xaaha
description: Go Flags Basics
draft: false
category: Reference Docs
---

# Working with flags in Go

```go
package main

import (
	"flag"
	"fmt"
	"strings"
)

func main() {
	fp := flag.String("fp", "./", "relative file path")
	env := flag.String("env", "global", "environment file to use during the call")

	flag.Parse()

	arguments := strings.Fields(*fp)
	if len(arguments) > 0 {
		*fp = strings.ToLower(arguments[0])
	} else {
		*fp = "./"
	}

	fmt.Println("File Path:", *fp)
	fmt.Println("Environment:", *env)
}
```
