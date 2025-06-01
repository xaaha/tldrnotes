package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
)

// FileReader can read files with several possible extensions
type FileReader struct {
	Extensions []string
}

// Read tries each extension in order and returns the content of the first found file
func (fr *FileReader) Read(slug string) (string, string, error) {
	for _, ext := range fr.Extensions {
		filename := slug + ext
		if _, err := os.Stat(filename); err == nil {
			f, err := os.Open(filename)
			if err != nil {
				return "", "", err
			}
			defer f.Close()
			b, err := io.ReadAll(f)
			if err != nil {
				return "", "", err
			}
			return string(b), ext, nil
		}
	}
	return "", "", os.ErrNotExist
}

// SlugReader interface
type SlugReader interface {
	Read(slug string) (string, string, error)
}

// PostHandler handles requests for /posts/{slug}
func PostHandler(sl SlugReader) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		content, ext, err := sl.Read(slug)
		if err != nil {
			http.Error(w, "Post not found", http.StatusNotFound)
			return
		}
		// Set Content-Type based on extension
		switch strings.ToLower(ext) {
		case ".html":
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
		case ".md", ".mdx":
			w.Header().Set("Content-Type", "text/markdown; charset=utf-8")
		default:
			w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		}
		fmt.Fprint(w, content)
	}
}

func main() {
	mux := http.NewServeMux()
	// You can add/remove extensions as you wish
	reader := &FileReader{Extensions: []string{".md", ".mdx", ".html"}}
	mux.HandleFunc("GET /posts/{slug}", PostHandler(reader))
	log.Fatal(http.ListenAndServe(":3030", mux))
}
