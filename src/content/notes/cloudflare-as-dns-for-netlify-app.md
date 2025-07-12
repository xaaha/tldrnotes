---
title: Cloudflare as DNS for Netlify App
date: 2025-07-12
description: How to use Cloudflare as DNS for the static site deployed in Netlify
draft: false
category: Cloudflare Netlify Deployment
---

## What's this?

Deploying [this website](https://www.xaaha.dev) to Netlify was simple—just connect GitHub, pick a repo, and you’re live. But getting the custom domain to work with Cloudflare DNS was trickier, especially when Netlify asked me to update nameservers.
This guide walks through how to keep Cloudflare as your DNS provider while hosting on Netlify, including how to properly redirect the apex domain such as, xaaha.dev, to your netlify site, in my case xaaha.netlify.app.

---

## Goal

- Use `Cloudflare DNS` instead of Netlify nameservers
- Serve your site on `www.xaaha.dev`
- Redirect `xaaha.dev → xaaha.netlify.app`

## Solution (Without Changing Nameservers)

### 1: Set up domain in Netlify

- Go to **Site Settings → Domain Management → Domains**
- Add both (this happened automatically for me when I added www.xaaha.dev):
  - `www.xaaha.dev` (set this as the **primary domain**)
  - `xaaha.dev` (keep this as a **domain alias** so it redirects)

### 2: Clean up DNS in Cloudflare

- Go to **Cloudflare → DNS tab**
- **Remove any existing NETLIFY or CNAME** record for `@` (xaaha.dev)
  > These often show up from enabling "Cloudflare DNS dashboard" redirects — delete them first.

### 3: Add correct DNS records in Cloudflare

```shell

Type: CNAME
Name: www
Value: xaaha.netlify.app

# do the same for apex domain
# but you need to disable the parking page for the domain in Cloudflare

Type: CNAME
Name: xaaha.dev
Value: xaaha.netlify.app
```

Which looks like this

![Cloudflare DNS Record](/images/cloudflare.png)

The CNAME connects `www.xaaha.dev` and `xaaha.dev` to the Netlify site.

### 4: 🧪 Test it

Visit `xaaha.dev` in the browser. Also, we can test it in the terminal

```bash
curl -I https://xaaha.dev
```

---

That's it!
