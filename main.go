// Package main is the main stuff
package main

import (
	"fmt"
	"log"
	"net/http"
)

// following: https://www.calhoun.io/building-a-blog-part-1/

// SlugReader reads the blogs
type SlugReader interface {
	Read(slug string) (string, error)
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /posts/{slug}", func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		fmt.Fprintf(w, "Post: %s", slug)
	})

	err := http.ListenAndServe(":3030", mux)
	if err != nil {
		log.Fatal(err)
	}
}
