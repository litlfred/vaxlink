#!/bin/sh
# Publish the redirect to the gh-pages branch, which Pages serves: the
# walkthrough moved to litlfred/smart-trust-demo (web/), published at
# https://litlfred.github.io/smart-trust-demo/vaxlink/. The root is replaced by
# site/ (index.html and 404.html, both redirecting there with the hash route
# kept), and the old STAGING/ previews go, so every old address redirects.
#
# PUBLISH_REMOTE overrides the URL pushed to (CI passes one with its token).
set -eu
remote=${PUBLISH_REMOTE:-$(git remote get-url origin)}
rev=$(git rev-parse --short HEAD)

out=$(mktemp -d)
if git ls-remote --exit-code --heads "$remote" gh-pages >/dev/null 2>&1; then
  git clone -q --depth 1 --branch gh-pages "$remote" "$out"
else
  git init -q -b gh-pages "$out"
fi
find "$out" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r site/. "$out"/
touch "$out/.nojekyll"

cd "$out"
git add -A
if git diff --cached --quiet; then
  echo "gh-pages already has the redirect of $rev"
  exit 0
fi
git -c user.name="${GIT_AUTHOR_NAME:-github-actions[bot]}" \
    -c user.email="${GIT_AUTHOR_EMAIL:-41898282+github-actions[bot]@users.noreply.github.com}" \
    commit -q -m "Publish the redirect to smart-trust-demo/vaxlink/ ($rev)"
git push -q "$remote" HEAD:gh-pages
echo "published the redirect ($rev) to gh-pages"
