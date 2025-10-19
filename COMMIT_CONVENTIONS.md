# Git Commit Conventions

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding or correcting tests
- **chore**: Changes to build process or auxiliary tools

### Scope (optional)
The scope should be the name of the feature or component affected:
- `auth`
- `blog`
- `chat`
- `analytics`
- `ui`
- `db`
- etc.

### Subject
- Use imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize first letter
- No period (.) at the end
- Maximum 72 characters

### Body (optional)
- Use imperative, present tense
- Include motivation for the change
- Contrast with previous behavior

### Footer (optional)
- Reference issue numbers
- Note breaking changes

## Examples

### Feature
```
feat(auth): add Google OAuth login

Implement Google OAuth authentication flow using Supabase Auth.
Users can now sign in with their Google accounts.

Closes #123
```

### Bug Fix
```
fix(chat): prevent duplicate messages on slow connection

Add message deduplication logic to handle race conditions
when network is slow. Messages are now keyed by unique ID.

Fixes #456
```

### Documentation
```
docs(readme): update installation instructions

Add steps for Supabase setup and environment variables.
```

### Chore
```
chore(deps): update React to 18.2.0
```

### Breaking Change
```
feat(api): change user profile endpoint structure

BREAKING CHANGE: The /api/profile endpoint now returns
{ user: {...} } instead of just {...}

Migration guide: Update all API calls to access data.user
```

## Quick Reference

Common commit examples:

```bash
# New feature
git commit -m "feat(blog): add post creation page"

# Bug fix
git commit -m "fix(analytics): correct player count calculation"

# UI improvement
git commit -m "style(ui): improve mobile responsive layout"

# Performance
git commit -m "perf(db): add indexes for faster queries"

# Refactor
git commit -m "refactor(auth): simplify login logic"

# Tests
git commit -m "test(chat): add unit tests for message component"

# Documentation
git commit -m "docs: add API documentation"

# Dependency update
git commit -m "chore(deps): update tailwind to 3.4.0"

# Configuration
git commit -m "chore(config): update vite config for production"
```

## Best Practices

1. **Atomic Commits**: Each commit should represent one logical change
2. **Commit Often**: Small, frequent commits are better than large ones
3. **Test Before Commit**: Ensure code works before committing
4. **Meaningful Messages**: Future you will thank present you
5. **Present Tense**: "add feature" not "added feature"
6. **No WIP Commits**: Avoid "work in progress" or "wip" commits in main branch

## Tools

### Commitizen (optional)
For guided commit message creation:
```bash
npm install -g commitizen
npm install -g cz-conventional-changelog

# Use it
git cz
```

### Commitlint (optional)
To enforce commit conventions:
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

---

**Remember**: Good commit messages help with debugging, code reviews, and project history!
