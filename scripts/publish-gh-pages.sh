#!/bin/sh
# Build the site from the current checkout and publish it to the gh-pages
# branch, which Pages serves (Settings → Pages → Source: Deploy from a branch,
# gh-pages, / root). main publishes to the root; every other branch to
# STAGING/<branch-slug>/, so a branch can be reviewed before it merges. The
# root keeps STAGING/, and a branch's publish touches only its own folder.
#
# The deploy workflow runs this on every push; by hand:
#   npm ci --ignore-scripts && sh scripts/publish-gh-pages.sh
#
# PUBLISH_BRANCH overrides the branch name (CI passes it, since its checkout
# is detached); PUBLISH_REMOTE overrides the URL pushed to (CI passes one
# with its token).
set -eu
branch=${PUBLISH_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}
remote=${PUBLISH_REMOTE:-$(git remote get-url origin)}
rev=$(git rev-parse --short HEAD)
slug=$(printf '%s' "$branch" | tr 'A-Z' 'a-z' | tr -c 'a-z0-9' '-' | sed 's/--*/-/g; s/^-//; s/-$//')

node scripts/sync-upstream.mjs --check
npm run build

out=$(mktemp -d)
if git ls-remote --exit-code --heads "$remote" gh-pages >/dev/null 2>&1; then
  git clone -q --depth 1 --branch gh-pages "$remote" "$out"
else
  git init -q -b gh-pages "$out"
fi

if [ "$branch" = main ]; then
  dest=$out
  find "$out" -mindepth 1 -maxdepth 1 ! -name .git ! -name STAGING -exec rm -rf {} +
  where=root
else
  dest=$out/STAGING/$slug
  rm -rf "$dest"
  mkdir -p "$dest"
  where=STAGING/$slug/
fi
cp -r dist/. "$dest"/
touch "$out/.nojekyll"

cd "$out"
git add -A
if git diff --cached --quiet; then
  echo "gh-pages already has the build of $rev at $where"
  exit 0
fi
git -c user.name="${GIT_AUTHOR_NAME:-github-actions[bot]}" \
    -c user.email="${GIT_AUTHOR_EMAIL:-41898282+github-actions[bot]@users.noreply.github.com}" \
    commit -q -m "Publish the VaxLink site built from $rev ($branch) at $where"
git push -q "$remote" HEAD:gh-pages
echo "published $rev ($branch) to gh-pages at $where"
