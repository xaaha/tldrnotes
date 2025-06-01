package posts

import "embed"

// imports omitted

//go:embed *.md

var Assets embed.FS
