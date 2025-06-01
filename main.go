// Package main is the goat
package main

import (
	"bytes"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	frontmatter "github.com/adrg/frontmatter"
	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
)

// FileReader can read files with several possible extensions
type FileReader struct{}

// Read opens a file with the given slug and reads its content
func (*FileReader) Read(slug string) (string, error) {
	file, err := os.Open(filepath.Join("posts", slug, ".md"))
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

// SlugReader interface defines the ability to read content based on a slug
type SlugReader interface {
	Read(slug string) (string, error)
}

// Post contains blog post frontmatter data
type Post struct {
	Title   string        `yaml:"title"`
	Slug    string        `yaml:"slug"`
	Content template.HTML // Rendered HTML content
	Author  Author        `yaml:"author"`
}

// Author represents the author of the blog post
type Author struct {
	Name  string `yaml:"name"`
	Email string `yaml:"email"`
}

// PostHandler handles requests for /posts/{slug}
func PostHandler(sl SlugReader) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var post Post
		post.Slug = r.PathValue("slug")

		// Read the markdown content using the SlugReader
		postMarkdown, err := sl.Read(post.Slug)
		if err != nil {
			http.Error(w, "Post not found", http.StatusNotFound)
			log.Printf("File not found for slug: %s, error: %v", post.Slug, err)
			return
		}

		// Parse the frontmatter and extract the remaining markdown content
		rest, err := frontmatter.Parse(strings.NewReader(postMarkdown), &post)
		if err != nil {
			// Log the error and proceed with default values for frontmatter
			log.Printf("Frontmatter parse error for slug: %s, error: %v", post.Slug, err)
			post.Title = "Untitled" // Set default title
			post.Author = Author{Name: "Unknown", Email: ""}
			rest = []byte(
				postMarkdown,
			) // Use the entire content as markdown if frontmatter is invalid
		}

		// Convert the markdown to HTML using goldmark
		var buf bytes.Buffer
		mdRenderer := goldmark.New(
			goldmark.WithExtensions(
				highlighting.NewHighlighting(
					highlighting.WithStyle("dracula"),
				),
			),
		)
		if err := mdRenderer.Convert(rest, &buf); err != nil {
			http.Error(w, "Error converting markdown", http.StatusInternalServerError)
			log.Printf("Markdown conversion error for slug: %s, error: %v", post.Slug, err)
			return
		}

		// Parse the layout HTML template
		tpl, err := template.ParseFiles("layout.html")
		if err != nil {
			http.Error(w, "Error parsing template", http.StatusInternalServerError)
			log.Printf("Template parse error: %v", err)
			return
		}

		// Set the converted markdown content into the Post struct
		post.Content = template.HTML(buf.String())

		// Set the Content-Type header
		w.Header().Set("Content-Type", "text/html; charset=utf-8")

		// Execute the template and write the response
		if err := tpl.Execute(w, post); err != nil {
			http.Error(w, "Error rendering template", http.StatusInternalServerError)
			log.Printf("Template execution error for slug: %s, error: %v", post.Slug, err)
			return
		}
	}
}

func main() {
	mux := http.NewServeMux()

	// Register the PostHandler with the FileReader as the SlugReader implementation
	mux.HandleFunc("GET /posts/{slug}", PostHandler(&FileReader{}))

	// Start the HTTP server
	log.Println("Server is running on http://localhost:3030")
	if err := http.ListenAndServe(":3030", mux); err != nil {
		log.Fatal(err)
	}
}
