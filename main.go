// Package main is the goat
package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// FileReader can read files with several possible extensions
type FileReader struct{}

func (*FileReader) Read(slug string) (string, error) {
	f, err := os.Open(slug + ".md")
	if err != nil {
		return "", err
	}
	defer f.Close()
	b, err := io.ReadAll(f)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

// SlugReader interface
type SlugReader interface {
	Read(slug string) (string, error)
}

// PostHandler handles requests for /posts/{slug}
func PostHandler(sl SlugReader) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		postMarkdown, err := sl.Read(slug)
		if err != nil {
			// TODO: Handle different errors in the future
			http.Error(w, "Post not found", http.StatusNotFound)
			return
		}
		fmt.Fprint(w, postMarkdown)
	}
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /posts/{slug}", PostHandler(&FileReader{}))

	err := http.ListenAndServe(":3030", mux)
	if err != nil {
		log.Fatal(err)
	}
}
