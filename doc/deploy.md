# Deploy to GitHub Pages

```bash
quarto publish gh-pages --no-prompt --id ip3200
```

- `_publish.yml` is required (created on first setup):

```yaml
- source: project
  gh-pages:
    - id: "ip3200"
      branch: gh-pages
```

- SSH auth required (`~/.ssh/id_rsa` must be registered on GitHub)
- Add `_site/` and `.quarto/` to `.gitignore` (do not commit build artifacts)
