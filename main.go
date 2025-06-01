// Package main is the goat
package main

import (
	"bytes"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
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

// PostData contains blogposts fontmatter data
type PostData struct {
	Title   string
	Content template.HTML
	Author  string
}

// PostHandler handles requests for /posts/{slug}
func PostHandler(sl SlugReader) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		postMarkdown, err := sl.Read(slug)
		if err != nil {
			http.Error(w, "Post not found", http.StatusNotFound)
			return
		}

		mdRenderer := goldmark.New(
			goldmark.WithExtensions(
				highlighting.NewHighlighting(
					highlighting.WithStyle("tokyonight-moon"),
				),
			),
		)

		var buf bytes.Buffer
		if err = mdRenderer.Convert([]byte(postMarkdown), &buf); err != nil {
			http.Error(w, "Error converting markdown", http.StatusInternalServerError)
			return
		}

		tpl, err := template.ParseFiles("layout.html")
		if err != nil {
			http.Error(w, "Error parsing template", http.StatusInternalServerError)
			return
		}
		err = tpl.Execute(w, PostData{
			Title:   "My First Post",
			Content: template.HTML(buf.String()),
			Author:  "xaaha",
		})

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = io.Copy(w, &buf)
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
