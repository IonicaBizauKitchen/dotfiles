fpath+=("/usr/local/share/zsh/site-functions")
autoload -Uz promptinit && promptinit
prompt pure

# PATH
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH
# export PATH="/Applications/Postgres.app/Contents/Versions/9.4/bin:$PATH"

# Use fresh git instead of XCode git
# http://goo.gl/kL1KRm
# export PATH="/usr/local/git/bin:$PATH"

# allow locally installed npm binaries to be executed
export PATH="$PATH:./node_modules/.bin"

setopt append_history # append history list to the history file

# Keep a long history
export HISTSIZE=10000
export HISTFILESIZE=10000
export SAVEHIST=10000
export HISTFILE=$HOME/.history
export EDITOR="atom"

# Getting around
alias ..='cd ..'
alias ...='cd ../../'
alias ....='cd ../../../'
alias la='ls -A1'
alias cp='cp -r'
alias rm=rmtrash
alias h=/usr/local/bin/heroku
alias exot=exit
alias d='cd ~/Desktop'
alias io=iojs
alias t='npm test'
alias i='npm install'
alias config='edit ~/.zshrc'
alias refresh='source ~/.zshrc; echo ".zshrc sourced"'
alias pull='git pull'
alias push='git push'
alias gs='git status'
alias status='git status'
alias st='git status'
alias cont='git rebase --continue'
alias diff='git diff'
alias co='git checkout'
alias c='git checkout'
alias com='git commit'
alias cherry='git cherry-pick'
alias stash='git stash'
alias gitx=stree
alias git=hub
alias sub='atom'
alias subl='atom'
alias mate='atom'

dir() {
  mkdir -p $1
  cd $1
}

# Create `cd foo` aliases for immediate subdirectories
# of the given directory (or directories).
#
# Usage:
# alias_subdirectories ~/n ~/personal
alias_subdirectories() {
  for dir in $(find $* -type d -mindepth 1 -maxdepth 1); do
    base=`basename $dir`
    # echo $dir
    if ! env which -s $base; then
      echo alias "'$base'"="'cd "'"'"$dir"'"'"'"
    fi
    done > ~/.aliases

  # Cache aliases for faster shell boot time
  source ~/.aliases
}

source ~/.aliases

# Update my favorite directories
function zindex {
  alias_subdirectories ~ ~/personal ~/fa
}

# Allows me to cd into projects
# cdpath=(. ~/code/ ~/code/hero ~/code/personal)
# cdpath=~/code/hero
# typeset -gU cdpath
# setopt autocd

skeleton() {
  git clone https://github.com/zeke/npm-skeleton $1
  cd $1
  rm -rf ./.git
  echo "FOO=BAR" >> .env
  echo "node_modules" >> .gitignore
  echo ".env" >> .gitignore
  npm install
  npm test
  git init
  git add .
  git commit -am "---=[ npm skeleton ]=---"
}

my_heroku_email() {
  cat $HOME/.netrc | grep "machine api\.heroku\.com" -C 1 | tail -n 1 | egrep -o "[^ ]+@heroku.com"
}

my_heroku_email_handle() {
  my_heroku_email | awk -F '@' '{print $1}'
}

destroy_temporary_heroku_apps() {
  hk apps | grep $(my_heroku_email) | awk '{print $1}' | grep -E '^[a-z]+-[a-z]+-\d{4}$' | while read app; do echo $app | hk destroy $app; done
}

hurl() {
  curl -n -H "Accept: application/vnd.heroku+json; version=3" https://api.heroku.com/$@
}

git_files_touched_by() {
  git log --no-merges --author="$1" --stat --name-only --pretty=format:"" | sort -u
}

git_files_untouched_by() {
  git log --no-merges --stat --name-only --pretty=format:"" | sort -u > /tmp/all
  git log --no-merges --author="$1" --stat --name-only --pretty=format:"" | sort -u > /tmp/user
  comm -3 /tmp/all /tmp/user
}

# git log --no-merges --stat --name-only --pretty=format:"" | sort -u > audit-all.txt
# git log --no-merges --stat --author="zeke" --name-only --pretty=format:"" | sort -u > audit-zeke.txt
# git log --no-merges --stat --author="rockbot" --name-only --pretty=format:"" | sort -u > audit-rockbot.txt
# comm -3 audit-all.txt audit-zeke.txt > audit-zeke-untouched.txt
# comm -3 audit-all.txt audit-rockbot.txt > audit-rockbot-untouched.txt

# Find all non-hidden files in the current path
ff() { find . -iname '*'$*'*' -type f ! -iname ".*" ! -path "*node_modules*"; }

# Find all non-hidden directories in the current path
fd() { find . -iname '*'$*'*' -type d ! -iname ".*" ! -path "*node_modules*"; }

# Find all files and directories in the current path,
# ignoring hidden files and node_modules
f() { find . -iname '*'$*'*' ! -iname ".*" ! -path "*node_modules*"; }
# alias fa=f

in() {
  mdfind \"$*\" -onlyin .
}

# Search the history
hist() { history | grep "$*"; }

edit() {
  dir=$1
  atom ${dir:-.} # default to .
}
alias e=edit

serve() {
  port=$1
  python -m SimpleHTTPServer ${port:=8000}
}

# Git

# commit "fix all the things"
# commit quotes not required if not using apostrophes and suchlike
commit() {
  git add .
  git commit -avm "$*" --allow-empty
}

uncommit() {
  git reset --soft HEAD~1
}

# npm shortcuts

npm() {
  if [ "$1" = "dev" ]; then
    npm run dev
  # elif [ "$1" = "open" ] && [ hash npmwd 2>/dev/null ]; then
  #   shift
  #   npmwd "$@"
  else
    command npm "$@"
  fi
}

# patch fix that bug
patch(){
  npm version patch -m "$*"
  npm publish
  git push origin master --follow-tags
}

# minor add that new backwards-compatible feature
minor(){
  npm version minor -m "$*"
  npm publish
  git push origin master --follow-tags
}

# major break old APIs with new hotness
major(){
  npm version major -m "$*"
  npm publish
  git push origin master --follow-tags
}

deploy() {
  if [ "$1" ]; then
    commit $*
  fi
  git push origin master
  git push heroku master
}

# Type `gd branchname` to list files that differ from current branch
gdiff() {
  git diff --name-status $(git symbolic-ref --short HEAD) $1
}

clone() {
  git clone $1
  cd $(basename $1)
  edit .
}

# Remove a remote and local git branch
prune() {
  git branch -d $1
  git push origin :$1
}

# List branches in reverse chronological order. http://goo.gl/1EKFx
alias branches="git for-each-ref --count=15 --sort=-committerdate refs/heads/ --format='%(refname:short)'"
alias bb=branches

# https://robots.thoughtbot.com/announcing-pick
# brew install pick
b() {
  git checkout $(branches | pick)
}

# Create a new issue with ghi
issue() { ghi open -m "$*"; }

repo(){ open "https://github.com/$1" }
