// Package main is the main stuff
package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// following: https://www.calhoun.io/building-a-blog-part-1/

// FileReader has the ability to read files
type FileReader struct{}

// Read takes in the file slug and file extension like (.md) to return
func (*FileReader) Read(slug string, extension string) (string, error) {
	file, err := os.Open(slug + extension)
	if err != nil {
		return "", err
	}
	defer file.Close()
	fileByte, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}
	return string(fileByte), nil
}

// SlugReader reads the blogs
type SlugReader interface {
	Read(slug string) (string, error)
}

// PostHandler handles the mux handler
func PostHandler(sl SlugReader) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		postMarkdown, err := sl.Read(slug)
		if err != nil {
			// TODO: Handle different errors in the future http.Error(w, "Post not found", http.StatusNotFound)
			return
		}
		fmt.Fprint(w, postMarkdown)
	}
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /posts/{slug}", PostHandler(FileReader{}))

	err := http.ListenAndServe(":3030", mux)
	if err != nil {
		log.Fatal(err)
	}
}
